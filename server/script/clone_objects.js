const dboo = require('dboo');
const user = require('../src/user.js');
const userid = require('../src/userid.js');
const list = require('../src/lists.js');
const parser = require('../src/parser.js');

dboo.init();

function getObjects(env1) {
  const db1Cfg = require(`../config/${env1}.json`);
  const db1 = db1Cfg['dbConfig'];
  const odb1 = new dboo.ODB();
  odb1.connect(db1.host, db1.port, db1.dbName, db1.webUserName, db1.webUserPwd);
  
  let users = [];
  let userPasswords = [];
  let sites = [];
  odb1.query(users, "select<User>()");
  odb1.query(userPasswords, "select<UserPassword>()");
  odb1.query(sites, "select<SiteConfig>()");
  
  return users.concat(userPasswords).concat();
}

function commitObjects(env2, objects) {
  const db2Cfg = require(`../config/${env2}.json`);
  const db2 = db2Cfg['dbConfig'];
  const odb2 = new dboo.ODB();
  odb2.connect(db2.host, db2.port, db2.dbName, db2.webUserName, db2.webUserPwd);
  
  for (let obj of objects) {
    if (obj instanceof user.User) {
      let userIds = [];
      odb2.query(userIds, 'select<UserId>(eq(userId, "' + obj.userId.userId + '"))');
      let users = [];
      odb2.query(users, 'select<User>(in(userId, select<UserId>(eq(userId, "' + obj.userId.userId + '"))))');
      if (users.length > 0 && users[0]) {
        console.log("Existing matching user ids found! Exiting");
      }
    }
  }
  odb2.commit(objects);
}

if (global.process.argv.length == 4) {
  let env1 = global.process.argv[2];
  let env2 = global.process.argv[3];
  
  if (env2 == 'prod') {
    console.log('Cannot clone into prod, exiting!');
    return;
  }
  
  console.log(`Cloning from ${env1} to ${env2}`)
  let objects = getObjects(env1);
  commitObjects(env2, objects);
} else {
  console.log("Usage: ");
  console.log("  clone_objects.sh <env 1> <env 2>");
  console.log("");
  console.log("Clones all data from env1 to env2");
  console.log("Example:");
  console.log("  clone_objects.sh prod test1");
}
