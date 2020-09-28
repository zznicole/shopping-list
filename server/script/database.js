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
const dboo = require('dboo.node');
const config = require('config');

dbConfig = config.get('dbConfig');
var host = dbConfig.host;
var port = dbConfig.port;
var dbName = dbConfig.dbName;
var dbGroup = dbConfig.dbGroup;
var webUserName = dbConfig.webUserName;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function createDatabase
/// Creates the myshoppinglist database. Does not create types. Use this once to create the database.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createDatabase(rootPwd, userPwd) {
  const odb = new dboo.ODB();
  odb.connect(host, port, "dboo::server", "root", rootPwd);
  
  console.log("Creating group, db and web user:");
  console.log("Group: " + dbGroup);
  console.log("Database: " + dbGroup);
  console.log("User id: " + userPwd);
  odb.create_group(dbGroup);
  odb.create_database(dbName, dbGroup);
  odb.create_user(webUserName, userPwd, dbGroup);
  console.log("Done");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function defineTypes
/// Calls the odb.define on all types for the myshoppinglist database. Do this every time types are
/// updated.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function defineTypes(userPwd) {
  const user = require('../src/user.js');
  const odb = new dboo.ODB();
  odb.connect(host, port, dbName, webUserName, userPwd);

  console.log("Defining classes:");
  console.log(user.User);
  odb.define(user.User);
  console.log(user.UserPassword);
  odb.define(user.UserPassword);
  console.log("Done");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function listUsers
/// Lists all users
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function listUsers(userPwd) {
  const user = require('../src/user.js');
  const odb = new dboo.ODB();
  odb.connect(host, port, dbName, webUserName, userPwd);
  users = [];
  odb.load_types();
  odb.query(users, "select<User>()");

  console.log("All users:");
  console.log(users);
  console.log("Done");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function deleteAllUsers
/// Lists all users
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteAllUsers(userPwd) {
  const user = require('../src/user.js');
  const odb = new dboo.ODB();
  odb.connect(host, port, dbName, webUserName, userPwd);
  count = odb.query("erase<User>()");

  console.log("Deleted all users: " + count);
  console.log("Done");
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Execution starts here
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ( (process.argv.length < 3) || ["--help", "-h", "help"].includes(process.argv[2])) {
  console.log("Usage: ");             
  console.log(process.argv[0] + " " + process.argv[1] + " <command> [<option1> <option2>... ]");
  console.log(process.argv[0] + " " + process.argv[1] + " create <root password> <new password for myshoppinglist>");
  console.log(process.argv[0] + " " + process.argv[1] + " updateTypes <myshoppinglist password>");
} else if ((process.argv.length == 5) && process.argv[2] == "create") {
  createDatabase (process.argv[3], process.argv[4]);
} else if ((process.argv.length == 4) && process.argv[2] == "updateTypes") {
  defineTypes (process.argv[3]);
} else if ((process.argv.length == 4) && process.argv[2] == "listUsers") {
  listUsers (process.argv[3]);
} else if ((process.argv.length == 4) && process.argv[2] == "deleteAllUsers") {
  deleteAllUsers (process.argv[3]);
}
