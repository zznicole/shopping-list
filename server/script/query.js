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
var webUserName = dbConfig.webUserName;
var webUserPwd = dbConfig.webUserPwd

dboo.init();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// function query
/// Runs the specified query and outputs the returned objects. If new_values is supplied, assigns the object
/// specified by the json string to the returned objects and commits the result.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function query(q, new_values) {
  const odb = new dboo.ODB();
  odb.connect(host, port, dbName, webUserName, webUserPwd);
  let results = [];
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

if ((process.argv.length == 3)) {
  query (process.argv[2]);
} else if ((process.argv.length == 4)) {
  query(process.argv[2], process.argv[3]);
}
