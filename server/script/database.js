/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Script that creates the database and defines the data types used in the database
//
// Run from command line.
//
// 1. Create database:
//
//    node src/database.js create <root password> <myshoppinglist password>
//
// 2. Define datatypes:
//
//    node src/database.js updateTypes  <myshoppinglist password>
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const dboo = require('dboo');
const config = require('config');
const user = require('../src/user.js');
const userid = require('../src/userid.js');
const list = require('../src/lists.js');
const parser = require('../src/parser.js');

dbConfig = config.get('dbConfig');
var host = dbConfig.host;
var port = dbConfig.port;
var dbName = dbConfig.dbName;
var dbGroup = dbConfig.dbGroup;
var webUserName = dbConfig.webUserName;
var webUserPwd = dbConfig.webUserPwd

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function createDatabase
/// Creates the myshoppinglist database. Does not create types. Use this once to create the database.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createDatabase(rootPwd) {
  const odb = new dboo.ODB();
  odb.connect(host, port, "dboo::server", "root", rootPwd);
  
  console.log("Creating group, db and web user:");
  console.log("Group: " + dbGroup);
  console.log("Database: " + dbName);
  console.log("User id: " + webUserName);
  odb.create_group(dbGroup);
  odb.create_database(dbName, dbGroup);
  odb.create_user(webUserName, webUserPwd, dbGroup);
  console.log("Done");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function defineTypes
/// Calls the odb.define on all types for the myshoppinglist database. Do this every time types are
/// updated.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function defineTypes() {
  const odb = new dboo.ODB();
  odb.connect(host, port, dbName, webUserName, webUserPwd);

  console.log("Defining classes:");
  console.log(user.User);
  odb.define(user.User);
  console.log(user.UserPassword);
  odb.define(user.UserPassword);
  console.log(list.Category);
  odb.define(list.Category);
  console.log(list.Item);
  odb.define(list.Item);
  console.log(list.ShoppingList);
  odb.define(list.ShoppingList);
  console.log(parser.SiteConfig);
  odb.define(parser.SiteConfig);
  console.log(userid.UserId);
  odb.define(userid.UserId);

  console.log("Done");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function query
/// Runs the specified query and outputs the returned objects. If new_values is supplied, assigns the object
/// specified by the json string to the returned objects and commits the result.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function query(q, new_values) {
  const odb = new dboo.ODB();
  odb.connect(host, port, dbName, webUserName, webUserPwd);
  let results = [];
  odb.load_types();
  count = odb.query(results, q);
  console.log(count + " objects affected");
  console.log(results);
  if (!(new_values === undefined)) {
    let nv = JSON.parse(new_values);
    
    for (let object of results) {
      Object.assign(object, nv);
      console.log(object);
    }
    odb.commit(results);
  }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function addSiteConfig
/// Adds new jquery config for the specified host
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addSiteConfig(host, config) {
  const odb = new dboo.ODB();
  odb.connect(host, port, dbName, webUserName, webUserPwd);
  let results = [];
  odb.query(results, "select<SiteConfig>(eq(host, '" + host + "'))");
  console.log(results);
  let sc = null;
  if (results.length == 1) {
    sc = results[0];
    sc.receiptsEnclosingElement = config;
    sc.valid = true;
  } else {
    sc = new parser.SiteConfig(host, config);
  }
  odb.commit(sc);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function listSiteConfig
/// Shows all site configs. if valid = true, only shows valid configs, otherwise all invalid.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function listSiteConfig(valid) {
  const odb = new dboo.ODB();
  odb.connect(host, port, dbName, webUserName, webUserPwd);
  let results = [];
  odb.query(results, "select<SiteConfig>(eq(valid, " + (valid ? "1" : "0") + "))");
  console.log(results);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Execution starts here
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( (process.argv.length < 3) || ["--help", "-h", "help"].includes(process.argv[2])) {
  console.log("Usage: ");             
  console.log(process.argv[0] + " " + process.argv[1] + " <command> [<option1> <option2>... ]");
  console.log(process.argv[0] + " " + process.argv[1] + " create <root password>");
  console.log(process.argv[0] + " " + process.argv[1] + " updateTypes");
  console.log(process.argv[0] + " " + process.argv[1] + " query <dboo query>");
  console.log(process.argv[0] + " " + process.argv[1] + " update <dboo query> <object values>");
  console.log(process.argv[0] + " " + process.argv[1] + " siteConfigs [valid]");
  console.log(process.argv[0] + " " + process.argv[1] + " setSiteConfig <host> <jquery filter>");
  console.log(process.argv[0] + " " + process.argv[1] + " setSiteConfig <host> <jquery>");
} else if ((process.argv.length == 4) && process.argv[2] == "create") {
  createDatabase (process.argv[3]);
} else if ((process.argv.length == 3) && process.argv[2] == "updateTypes") {
  defineTypes ();
} else if ((process.argv.length == 4) && process.argv[2] == "query") {
  query (process.argv[3]);
} else if ((process.argv.length == 5) && process.argv[2] == "update") {
  query (process.argv[3], process.argv[4]);
// } else if ((process.argv.length == 5) && process.argv[2] == "insert") {
//   query (process.argv[3], process.argv[4]);
} else if ((process.argv.length == 4) && process.argv[2] == "siteConfigs") {
  listSiteConfig (process.argv[3] == "valid");
} else if ((process.argv.length == 5) && process.argv[2] == "setSiteConfig") {
  addSiteConfig (process.argv[3], process.argv[4]);
}
