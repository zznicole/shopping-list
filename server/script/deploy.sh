#!/bin/bash

server_user=ubuntu
server_address=13.53.58.58
keys_file="~/Documents/projects/shoppinglist/aws/ec2/keys/TestAccountStockholm.pem"
local_build_dir="${HOME}/src/shoppinglist_build"
server_base_dir="/home/ubuntu/shopping-list"
datetime=`date '+%Y%m%d_%H%M%S' `
server_install_dir="${server_base_dir}/shoppinglist_${datetime}"
server_current_dir="${server_base_dir}/shoppinglist_current"
server_config_dir="/home/ubuntu/config"
server_backup_dir="/home/ubuntu/db-backups"

# 1. clone locally/pull
echo "local build dir: ${local_build_dir}"
echo "getting source from github..."
if [[ -d "${local_build_dir}/.git" ]]; then
  cd ${local_build_dir}
  git pull
else
  mkdir -p ${local_build_dir}
  cd ${local_build_dir}
  git clone https://github.com/zznicole/shopping-list.git .
fi
echo "getting source from github...done"

# 2. Build web pack
echo "building client..."
cd client
npm install
npm run-script build
cd ..
echo "building client...done"

# 3. Create directories
echo "making directories on server..."
ssh -i "${keys_file}" ${server_user}@${server_address} "mkdir -p ${server_backup_dir}"
echo "created ${server_backup_dir}  done."
ssh -i "${keys_file}" ${server_user}@${server_address} "mkdir -p ${server_install_dir}/client/build/"
echo "created ${server_install_dir}/client/build/   done."
ssh -i "${keys_file}" ${server_user}@${server_address} "mkdir -p ${server_install_dir}/server/"
echo "created ${server_install_dir}/server/   done."
echo "copy client web pack to server..."
scp -r -i "${keys_file}" client/build/* ubuntu@13.53.58.58:${server_install_dir}/client/build/
echo "copy client web pack to server...done"
echo "copy server code to server..."
scp -r -i "${keys_file}" server/* ubuntu@13.53.58.58:${server_install_dir}/server/
echo "copy server code to server...done"
echo "link server configuration directory..."
ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_install_dir}/server; ln -s ${server_config_dir} config"
echo "link server configuration directory...done"

# 4. npm install on server
echo "install server node modules..."
ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_install_dir}/server/; npm install"
echo "install server node modules...done"

# 5. backup database - assuming server scripts are already there
if ssh ${server_user}@${server_address} '[ -d ${server_current_dir} ]'; then
  echo "there is a server already"
  echo "stopping server..."
  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_current_dir}/server/; sudo pm2 stop server.js"
  echo "stopping server...done"
else
  echo "there is no server to stop"
fi
echo "making backup of database..."
ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_install_dir}/server/; node ./script/backup.js ${server_backup_dir}"
echo "making backup of database...done"

# 6. switching current link
echo "switching current link to ${server_install_dir}"
if ssh ${server_user}@${server_address} '[ -d ${server_current_dir} ]'; then
  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_base_dir}; rm ${server_current_dir}"
fi
ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_base_dir}; ln -s ${server_install_dir} ${server_current_dir}"
echo "switching current link to ${server_install_dir}...done"

# 7. restart server
echo "starting server..."
ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_current_dir}/server/; sudo pm2 start server.js"
echo "starting server...done"

