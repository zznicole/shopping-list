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
const prompt = require('prompt');

let dbConfig = config.get('dbConfig');
let host = dbConfig.host;
let port = dbConfig.port;
let dbName = dbConfig.dbName;
let dbGroup = dbConfig.dbGroup;
let webUserName = dbConfig.webUserName;
let webUserPwd = dbConfig.webUserPwd

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function createDatabase
/// Creates the myshoppinglist database. Does not create types. Use this once to create the database.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
dboo.init();

function createDatabase(rootUser, rootPwd) {
  console.log("Connecting as " + rootUser.toString());
  const odb = new dboo.ODB();
  odb.connect(host, port, "dboo::server", rootUser, rootPwd);
  
  console.log("Creating group, db and web user:");
  console.log("Group: " + dbGroup);
  console.log("Database: " + dbName);
  console.log("User id: " + webUserName);
  odb.create_group(dbGroup);
  odb.create_database(dbName, dbGroup);
  odb.create_user(webUserName, webUserPwd, dbGroup);
  console.log("Done");
}

var schema = {
  properties: {
    userid: {
      description: 'Root user id',
      default: 'root',
    },
    password: {
      description: 'Root password',
      hidden: true,
      replace: '*',
      default: ''
    }
  }
};

//
// Start the prompt
//
prompt.start();

//
// Get two properties from the user: email, password
//
prompt.get(schema, function (err, result) {
  if (err) {
    console.log(err);
    return 1;
  }
  createDatabase(result.userid, result.password);
});