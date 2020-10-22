#!/bin/bash
#run in shopping-list/server so that the certificates are produced in shopping-list/server/certs

if [[ -f "./server.js" ]]; then
  mkdir -p certs
  openssl req -nodes -new -x509 -keyout certs/selfsigned.key -out certs/selfsigned.crt
else
  echo "No server.js file found in current directory. You must be in same directory as server.js when running this command!"
fi
