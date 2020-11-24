There are a few useful scripts for deployment:

- **create_environment.sh** can create a new test/stage/prod environment on the server.
- **deploy.sh** can build and deploy code to any environment on the server (which must have been created with create_environment.sh. 
- **move_staging_to_prod.sh** moves the current staging environment into prod environment. Only the code is moved, not the data.

For both scripts, a key file must exist to enable ssh access to the server.

create_environment.sh
---------------------
_create_environment.sh_

This script will ask the user for each parameter. The most important is the environment name, http port and https port. Other parameters can be defaulted. Environment name cannot exist before and should be descriptive. http port and https port should be unique among all environments, and it is these ports that are used when accessing the web site. The firewall must be set to let through any requests to these ports (do that through the AWS EC2 management console).

Example:
```
create_environment.sh
Environment: **test2**
Website domain [www.ourshoppinglist.online]: **\<Enter\>**
HTTP port [80]: **100**
HTTPS port [443]: **543**
Website URL [https://www.ourshoppinglist.online:543]:  **\<Enter\>**
Db server host name [localhost]:  **\<Enter\>**
Db server port [8822]:  **\<Enter\>**
Database name [ourshoppinglist_test2]:  **\<Enter\>**
Database user id [user_ourshoppinglist_test2]:  **\<Enter\>**
Database user password [generate]:  **\<Enter\>**
{
  "dbConfig": {
    "host": "localhost",
...
}
.temp.test2.json                                                                                                                                      100%  443    55.3KB/s   00:00    
```

deploy.sh
---------

_deploy.sh \<environment\> [options ...]_

This script will for prod and staging clone or pull the source code from github and build the client code. For test environments it will use the code as is in the current working copy of the git repo.
It will copy all built files for the client and all necessary source files and scripts for the server to the correct environment directory, stop the current node instance for that environment, reset symbolic links to the updated code and start node by using pm2. If the environment does not exist, the script will also create the database, database user and group.
Options:

- **--skip-build** Skips the build step. Useful if you already have a built client for your test environment.
- **--create-db** Always tries to create the database. If the database already exist, this will have no effect.
- **--update-types** Updates the database types. Will always be done if the database is being created.
- **--clone-\<env\>** Clones all objects from _env_. If specified, create-db will be invoked as well. Do only on empty databases. 

Examples:
```
deploy.sh staging --update-types
```
```
deploy.sh test2 --skip-build --create-db
```
```
deploy.sh test2 --skip-build --clone-prod
```

move_staging_to_prod.sh
-----------------------

_move_staging_to_prod.sh_

Makes the current staging code the new production code. Stops both prod and staging servers. Removes the prod link to the server and client files. Renames the staging link to prod. Restarts the prod node server.

Example:
```
 ./move_staging_to_prod.sh
```
