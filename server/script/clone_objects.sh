#!/bin/bash

# Server address:
server_address=13.53.58.58
# SSH key for accessing server:
keys_file="${HOME}/src/shoppinglist_config/ec2_key.pem"

server_user=ubuntu

user_home_dir="/home/ubuntu"


ssh -i "${keys_file}" ${server_user}@${server_address} "cd ${server_install_dir}/server/; NODE_ENV=${environment} node ./script/create_database.js"
