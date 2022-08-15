#!/bin/bash

# Can be test1, test2, staging, prod:
environment=${1}
create_db=false
update_types=false
do_build=true
clone_db=false
for var in "$@"
do
    if [[ "${var}" == "--create-db" ]]; then
      create_db=true
    fi
    if [[ "${var}" == "--update-types" ]]; then
      update_types=true
    fi
    if [[ "${var}" == "--skip-build" ]]; then
      do_build=false
    fi
    if [[ "${var}" =~ ^--clone-.*$ ]]; then
      create_db=true
      clone_db=true
      cloned_env=$(echo ${var}| cut -d'-' -f 4)
      echo "cloning ${cloned_env}"
    fi
done

# Server address:
#server_address=13.53.58.58
server_address=ourshoppinglist.online
# SSH key for accessing server:
keys_file="${HOME}/src/shoppinglist_config/ec2_key.pem"


if [[ ! "${environment}" =~ ^(test1|test2|staging|prod)$ ]]; then
  echo "Usage:"
  echo "  ${0} <environment> [options ...]"
  echo "Environment must be one of test1, test2, staging or prod, or any other existing environment."
  echo "Environments can be created with the create_environment.sh script."
  echo "Available options:"
  echo "  --skip-build     Do not do npm run-script build of client code (a build must already exist)"
  echo "  --update-types   Updates the database type definitions. Always done with --create-db"
  echo "  --create-db      Creates the database as per the environment's config file. If a database exist, it is NOT overridden."
  echo "Key file '${keys_file}' must exist and have valid key for server."
  exit
fi

if [[ "${environment}" == "prod" ]]; then
  # Cannot drop prod db:
  drop_db=false
  echo "Are you sure you want to deploy straight to prod? It may be better to:"
  echo "1. Deploy to staging: ${0} staging"
  echo "2. Test on staging ports"
  echo "3. Move staging to prod: move_stage_to_prod.sh"
  read -p "Answer yes to deploy to prod or no to cancel [no]: " install_to_prod
  install_to_prod=${install_to_prod:-no}
  if [[ "${install_to_prod}" != yes ]]; then
    echo "Cancel install to prod, exiting."
    exit;
  fi
fi

# Check if key file exist:
if [ ! -f" ${keys_file}" ]; then
  echo "Server key file '${keys_file}' not found!"
fi
# If doing a clean build from github, do it in this directory:
local_build_dir="${HOME}/src/shoppinglist_build"

server_user=ubuntu

user_home_dir="/home/ubuntu"

server_base_dir="${user_home_dir}/shoppinglist"
server_config_dir="${server_base_dir}/config"
server_backup_dir="${server_base_dir}/db-backups"

datetime=`date '+%Y%m%d_%H%M%S' `
git_describe=`git describe --tags --dirty --long --always`

# Server will be installed in directory called shoppinglist_YYYYMMDD_HHMMSS_<tag>-<commit>-<dirty flag>
server_install_dir=""
# A link will be created that points to the installation dir, and node is run from this link
server_current_dir=""

#################################################################################
# 1. Figure out what code to deploy
if [[ "${environment}" =~ ^(staging|prod)$ ]]; then
  server_current_dir="${server_base_dir}/prod/shoppinglist_${environment}"
  server_install_dir="${server_base_dir}/prod/files/shoppinglist_${datetime}_${git_describe}"
  # If staging or prod env, always clone or pull from github
  echo "local build dir: ${local_build_dir}"
  echo "getting source from github..."
  if [[ -d "${local_build_dir}/.git" ]]; then
    cd ${local_build_dir}
    git reset --hard
    git pull
  else
    mkdir -p ${local_build_dir}
    cd ${local_build_dir}
    git clone https://github.com/zznicole/shopping-list.git .
  fi
  echo "getting source from github...done"
else
  server_current_dir="${server_base_dir}/${environment}/shoppinglist_${environment}"
  server_install_dir="${server_base_dir}/${environment}/files/shoppinglist_${datetime}_${git_describe}"
  # If a test env, use the git working copy we are currently in
  # jump to top level of working copy:
  cd `git rev-parse --show-toplevel`
fi

#################################################################################
# 2. Build web pack
if [ "${do_build}" = true ] ; then
  echo "building client..."
  cd client
  npm install
  npm install @fortawesome/react-fontawesome
  npm install @fortawesome/free-solid-svg-icons
  npm run-script build
  cd ..
  echo "building client...done"
else
  echo "skipping build of client"
fi

#################################################################################
# 3. Create directories on server
echo "making directories on server..."
ssh -i "${keys_file}" ${server_user}@${server_address} "mkdir -p ${server_backup_dir}"
echo "created ${server_backup_dir}  done."
ssh -i "${keys_file}" ${server_user}@${server_address} "mkdir -p ${server_install_dir}/client/build/"
echo "created ${server_install_dir}/client/build/   done."
ssh -i "${keys_file}" ${server_user}@${server_address} "mkdir -p ${server_install_dir}/server/"
echo "created ${server_install_dir}/server/   done."

#################################################################################
# 4. Copy files to server
echo "copy client web pack to server..."
rsync -var -e "ssh -i \"${keys_file}\"" client/build/*  ubuntu@${server_address}:${server_install_dir}/client/build/
#scp -r -i "${keys_file}" client/build/* ubuntu@13.53.58.58:${server_install_dir}/client/build/
echo "copy client web pack to server...done"
echo "copy server code to server..."
rsync -var -e "ssh -i \"${keys_file}\"" \
  --exclude node_modules \
  server/README.md \
  server/package-lock.json \
  server/package.json \
  server/ShoppingList API.rst \
  server/script \
  server/data \
  server/server.js \
  server/src \
    ubuntu@${server_address}:${server_install_dir}/server
echo "copy server code to server...done"
echo "link server configuration directory..."
ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_install_dir}/server; ln -s ${server_config_dir} config"
echo "link server configuration directory...done"

#################################################################################
# 5. npm install on server
echo "install server node modules..."
ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_install_dir}/server/; npm install"
echo "install server node modules...done"

#################################################################################
# 6. backup database
make_db_backup=false
if ssh -i "${keys_file}" ${server_user}@${server_address} "[ -e ${server_current_dir} ]"; then
  echo "there is a server already"
  echo "stopping server..."
  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_current_dir}/server/; sudo pm2 delete ${environment}"
  echo "stopping server...done"
  make_db_backup=true
else
  echo "there is no server to stop, create database"
  create_db=true
fi

#if [ "${make_db_backup}" = true ] ; then
#  echo "making backup of database..."
#  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_install_dir}/server/; NODE_ENV=${environment} node ./script/backup.js ${server_backup_dir}"
#  ssh -i "${keys_file}" ${server_user}@${server_address} \
#    "cd ${server_install_dir}/server/; /opt/dboo/dboo-0.9.5/bin/dboo ${dbname} -u=${dbuser} -p=${dbpwd} --host=${host} --port=${port} -- backup --directory=${server_backup_dir}"
#  echo "making backup of database...done"
#fi

if [ "${create_db}" = true ] ; then
  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_install_dir}/server/; NODE_ENV=${environment} node ./script/create_database.js"
  update_types=true
fi

if [ "${update_types}" = true ] ; then
  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_install_dir}/server/; NODE_ENV=${environment} node ./script/define_types.js"
fi

if [ "${clone_db}" = true ] ; then
  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_install_dir}/server/; NODE_ENV=${environment} node ./script/clone_objects.js ${cloned_env} ${environment}"
fi

#################################################################################
# 7. switching current link
echo "switching current link to ${server_install_dir}"
if ssh -i "${keys_file}" ${server_user}@${server_address} "[ -e ${server_current_dir} ]"; then
  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_base_dir}; rm ${server_current_dir}"
fi
ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_base_dir}; ln -s ${server_install_dir} ${server_current_dir}"
echo "switching current link to ${server_install_dir}...done"

#################################################################################
# 8. restart server
echo "starting server..."
ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_current_dir}/server/; sudo NODE_ENV=${environment} pm2 start server.js --name ${environment}"
echo "starting server...done"

