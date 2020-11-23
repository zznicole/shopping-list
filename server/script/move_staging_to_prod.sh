# Server address:
server_address=13.53.58.58
# SSH key for accessing server:
keys_file="${HOME}/src/shoppinglist_config/ec2_key.pem"

# Check if key file exist:
if [ ! -f" ${keys_file}" ]; then
  echo "Server key file '${keys_file}' not found!"
fi

server_user=ubuntu
user_home_dir="/home/ubuntu"
server_base_dir="${user_home_dir}/shoppinglist"
server_backup_dir="${server_base_dir}/db-backups"

server_prod_dir="${server_base_dir}/prod/shoppinglist_prod"
server_staging_dir="${server_base_dir}/prod/shoppinglist_staging"

# 1. stop staging and prod servers
if ssh -i "${keys_file}" ${server_user}@${server_address} "[ -e ${server_prod_dir} ]"; then
  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_prod_dir}/server/; sudo pm2 delete prod"
fi
if ssh -i "${keys_file}" ${server_user}@${server_address} "[ -e ${server_staging_dir} ]"; then
  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_staging_dir}/server/; sudo pm2 delete staging"
fi

# 2. remove prod link
if ssh -i "${keys_file}" ${server_user}@${server_address} "[ -e ${server_prod_dir} ]"; then
  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_base_dir}; rm ${server_prod_dir}"
fi

# 3. rename staging link to prod
if ssh -i "${keys_file}" ${server_user}@${server_address} "[ -e ${server_staging_dir} ]"; then
  ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_base_dir}; mv ${server_staging_dir} ${server_prod_dir}"
fi

# 4. start prod server => staging does not exist anymore
echo "starting server..."
ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_prod_dir}/server/; sudo NODE_ENV=prod pm2 start server.js --name prod"
echo "starting server...done"
