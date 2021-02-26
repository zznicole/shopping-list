const dboo = require('dboo');
const config = require('config');
const user = require('../src/user.js');
const userid = require('../src/userid.js');
const list = require('../src/lists.js');
const parser = require('../src/parser.js');
const aggregator = require('../src/aggregator.js');

dbConfig = config.get('dbConfig');
var host = dbConfig.host;
var port = dbConfig.port;
var dbName = dbConfig.dbName;
var dbGroup = dbConfig.dbGroup;
var webUserName = dbConfig.webUserName;
var webUserPwd = dbConfig.webUserPwd

dboo.init();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function define_types
/// Calls the odb.define on all types for the myshoppinglist database. Do this every time types are
/// updated.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function define_types() {
  const odb = new dboo.ODB();
  odb.connect(host, port, dbName, webUserName, webUserPwd);
  
  console.log("Defining classes:");
  console.log(user.User);
  odb.define(user.User);
  console.log(user.UserPassword);
  odb.define(user.UserPassword);
  console.log(list.Category);
  odb.define(list.Category);
  console.log(list.ItemType);
  odb.define(list.ItemType);
  console.log(list.Item);
  odb.define(list.Item);
  console.log(list.ShoppingList);
  odb.define(list.ShoppingList);
  console.log(parser.SiteConfig);
  odb.define(parser.SiteConfig);
  console.log(userid.UserId);
  odb.define(userid.UserId);
  console.log(aggregator.Word);
  odb.define(aggregator.Word);
  console.log(aggregator.WordCategory);
  odb.define(aggregator.WordCategory);
  console.log(aggregator.Config);
  odb.define(aggregator.Config);
  
  console.log("Done");
}

define_types();