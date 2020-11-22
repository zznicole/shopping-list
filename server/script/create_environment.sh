#!/bin/bash
#
# Creates a test, staging or production environment.
# Creates config file, dboo database

read -p 'Environment: ' environment
read -p 'Website domain [www.ourshoppinglist.online]: ' web_host
web_host=${web_host:-www.ourshoppinglist.online}
read -p 'HTTP port [80]: ' http_port
http_port=${http_port:-80}
read -p 'HTTPS port [443]: ' https_port
https_port=${https_port:-443}
web_url_default=""
if [[ "${https_port}" == "443" ]]; then
  web_url_default="https://${web_host}"
else
  web_url_default="https://${web_host}:${https_port}"
fi
read -p "Website URL [${web_url_default}]: " web_url
web_url=${web_url:-${web_url_default}}
read -p 'Db server host name [localhost]: ' db_host
db_host=${db_host:-localhost}
read -p 'Db server port [8822]: ' db_port
db_port=${db_port:-8822}
default_db_name=`echo ${web_host} | awk -F. '{print $(NF-1) }'`_${environment}
read -p "Database name [${default_db_name}]: " db_name
db_name=${db_name:-${default_db_name}}
read -p "Database user id [user_${db_name}]: " db_user
db_user=${db_user:-user_${db_name}}
read -p 'Database user password [generate]: ' -s db_password
db_password=${db_password:-$(dd if=/dev/urandom bs=1 count=32 2>/dev/null | base64 | rev | cut -b 2- | rev)}
printf "\n"

db_group=${db_user}

# Server address:
server_address=13.53.58.58
# SSH key for accessing server:
keys_file="${HOME}/src/shoppinglist_config/ec2_key.pem"
# If doing a clean build from github, do it in this directory:
local_build_dir="${HOME}/src/shoppinglist_build"
server_user=ubuntu
user_home_dir="/home/ubuntu"
server_config_dir="${user_home_dir}/shoppinglist/config"
config_filepath=${server_config_dir}/${environment}.json

# 1. create config file
ssh -i "${keys_file}" ${server_user}@${server_address} "mkdir -p ${server_config_dir}"
cat <<EOF >.temp.${environment}.json
{
  "dbConfig": {
    "host": "${db_host}",
    "port": ${db_port},
    "dbName": "${db_name}",
    "dbGroup": "${db_group}",
    "webUserName": "${db_user}",
    "webUserPwd": "${db_password}"
  },
  "hostConfig": {
    "URL": "${web_url}",
    "host": "${web_host}",
    "port": "${https_port}",
    "httpPort": "${http_port}",
    "useSSL": true
  }
}
EOF

cat .temp.${environment}.json
scp -i "${keys_file}" .temp.${environment}.json ${server_user}@${server_address}:${config_filepath}

