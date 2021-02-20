const dboo = require('dboo');
const config = require('config');
const aggregator = require('../src/aggregator.js');

dbConfig = config.get('dbConfig');
var host = dbConfig.host;
var port = dbConfig.port;
var dbName = dbConfig.dbName;
var dbGroup = dbConfig.dbGroup;
var webUserName = dbConfig.webUserName;
var webUserPwd = dbConfig.webUserPwd

dboo.init();

function load_data() {
  const odb = new dboo.ODB();
  odb.connect(host, port, dbName, webUserName, webUserPwd);
  
  aggregator.initData(odb, './data/categories');
}

load_data();

