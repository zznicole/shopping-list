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
let directory = ".";
let basename = dbConfig.dbName;
let extension = ".dboo";

if ((process.argv.length == 3)) {
  directory = process.argv[2];
}

dboo.init();
const odb = new dboo.ODB();
odb.connect(host, port, dbName, webUserName, webUserPwd);

function new_filename(basename) {
  return basename + "_" + moment().format("YYYYMMDD_hhmmss") + extension;
}

function new_filepath(directory, basename) {
  return path.join(directory, new_filename(basename));
}

let filepath = new_filepath(directory, basename);
odb.backup_database(filepath);

try {
  fs.accessSync(filepath, fs.constants.R_OK | fs.constants.W_OK);
  console.log(`Database backup saved in file: ${filepath}`);
} catch (e) {
  console.log(`Error producing backup. File ${filepath} not found.`);
  console.log(e);
}
