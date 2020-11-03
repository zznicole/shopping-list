=========================
My shopping list - Server
=========================

Dependencies
============

Node modules required:

* express.js: npm install express
* config: npm install config
* moment: npm install moment
* axios
* dboo

A dboo database

Configuration files
===================
A configuration file must exist in server/config.

SSL
===
SSL keys and certificates are required for https to work. To generate
a certificate with Let's Encrypt on Ubuntu, do the following:

```
# insstall certbot
sudo add-apt-repository ppa:certbot/certbot
sudo apt install certbot

# generate certificates
sudo certbot certonly --standalone -d ourshoppinglist.online -d www.ourshoppinglist.online

# add paths to certificate and encryption key in:
emacs shopping-list/server/config/default.json 

# Keys should be added in "ssl" section in config file:
#  "ssl": {
#	"cert": "/etc/letsencrypt/live/ourshoppinglist.online/fullchain.pem",
#	"key": "/etc/letsencrypt/live/ourshoppinglist.online/privkey.pem"
#  }

```

Deployment
==========
To deploy the shopping list, get the desired version from github.

1. Build webpack for client side:
```shell script
cd shopping-list/client
npm install
npm run-script build
```

2. Update npm on server side
```shell script
cd shopping-list/server
npm install
rm -rf node_modules/dboo # Is the last two steps really needed?
npm install dboo # Is the last two steps really needed?
``` 

3. Has there been updates for dboo version?

4. Create database (first time)
```shell script
cd shopping-list/server
node ./scripts/database create '<db root password>'
``` 

5. Update database types:
This will update the dboo class definitions to the latest. Note that the node API for dboo does not yet 
support too advanced changes in class definitions. 

```shell script
cd shopping-list/server
node ./scripts/database updateTypes
``` 

Start
=====
Use pm2 for running the production server. Use node 

Install pm2 on ubuntu:


Start node:


Design
======

Database
--------

Authentication & Session management
-----------------------------------

New items
---------

Parser
------


