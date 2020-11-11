const dboo = require('dboo');
const config = require('config');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

dbConfig = config.get('dbConfig');
let host = dbConfig.host;
let port = dbConfig.port;
let dbName = dbConfig.dbName;
let webUserName = dbConfig.webUserName;
let webUserPwd = dbConfig.webUserPwd

const odb = new dboo.ODB();
odb.connect(host, port, dbName, webUserName, webUserPwd);

let filepath = "";
if (global.process.argv.length == 3) {
  filepath = global.process.argv[2];
}

try {
  
  fs.accessSync(filepath, fs.constants.R_OK);
  odb.restore_database(filepath);

  console.log(`Database restored from file: ${filepath}`);
  
} catch (e) {
  console.log(`Error restoring from file ${filepath}.`);
  console.log(e);
}
