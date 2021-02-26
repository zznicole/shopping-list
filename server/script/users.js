const dboo = require('dboo');
const config = require('config');
const user = require('../src/user.js');
const userid = require('../src/userid.js');
const fs = require('fs');
const readline = require('readline');

dbConfig = config.get('dbConfig');

dboo.init();
const odb = new dboo.ODB();
console.log(dbConfig);
odb.connect(dbConfig.host, dbConfig.port, dbConfig.dbName, dbConfig.webUserName, dbConfig.webUserPwd);


function backupUsers()
{
  let uids = [];
  odb.query(uids, "select<UserId>()");
  for (const uid of uids) {
    let str = `{"dboo::objectid" : "${odb.objectid(uid)}", "dboo::class" : "UserId", "userId" : "${uid.userId}", "screenName" : "${uid.screenName}"}`;
    console.log(str);
    fs.appendFileSync('userid.json', str + '\n');
  }
  let upwds = [];
  odb.query(upwds, "select<UserPassword>()");
  for (const upwd of upwds) {
    let str = `{"dboo::objectid" : "${odb.objectid(upwd)}", "dboo::class" : "UserPassword", "userId" : "${odb.objectid(upwd.userId)}", "passwordHash" : "${upwd.passwordHash}", "salt" : "${upwd.salt}", "iterations" : ${upwd.iterations}}`;
    console.log(str);
    fs.appendFileSync('userpwd.json', str + '\n');
  }
  let users = [];
  odb.query(users, "select<User>()");
  for (const usr of users) {    
    let str = `{"dboo::objectid" : "${odb.objectid(usr)}", "dboo::class" : "User", "userId" : "${odb.objectid(usr.userId)}", "emailAddress" : "${usr.emailAddress}", "firstName" : "${usr.firstName}", "lastName" : "${usr.lastName}", "permissions" : [], "lists" : [], "preferred_locale" : ""}`
    console.log(str);
    fs.appendFileSync('users.json', str + '\n');
  }
}


function restoreUsers()
{
  let objects = new Map();
  let objectArray = [];
  
  let lineReader = readline.createInterface({input: fs.createReadStream('userid.json')});
  lineReader.on('line', function (line) {
    let o = JSON.parse(line);
    let no = new userid.UserId();
    Object.assign(no, restored);
    odb.setid(no, no['dboo::objectid']);
    objects.set(no['dboo::objectid'], no);
    objectArray.append(no);
  });  

  lineReader = readline.createInterface({input: fs.createReadStream('userpwd.json')});
  lineReader.on('line', function (line) {
    console.log('Line from file:', line);
    let o = JSON.parse(line);
    let no = new user.UserPassword();
    Object.assign(no, restored);
    odb.setid(no, no['dboo::objectid']);
    objects.set(no['dboo::objectid'], no);
    no['userId'] = objects.get(no['userId']);
    objectArray.append(no);
  });  
  
  lineReader = readline.createInterface({input: fs.createReadStream('users.json')});
  lineReader.on('line', function (line) {
    console.log('Line from file:', line);
    let o = JSON.parse(line);
    let no = new user.User();
    Object.assign(no, restored);
    odb.setid(no, no['dboo::objectid']);
    objects.set(no['dboo::objectid'], no);
    no['userId'] = objects.get(no['userId']);
    objectArray.append(no);
  });
  
  odb.commit(objectArray);
}

function makeUserAdmin(userId)
{
  let users = [];
  odb.query(users, "select<User>(eq(userId,\"" + dboo.escape_string(userId) + "\"))")
  if (users.length == 1) {
    let usr = users[0];
    console.log(usr);
    if (!usr.permissions.includes(user.admin)) {
      usr.permissions.push(user.admin);
      console.log(usr);
      odb.commit(usr);
      console.log("User %s updated, was made an administrator.", userId);
    } else {
      console.log("User %s not updated, already an administrator.", userId);
    }
  } else {
    console.log("No user named '%s' exist.", userId);
  }
}


if ((process.argv.length == 4) && process.argv[2] == "makeAdmin") {
  makeUserAdmin (process.argv[3]);
}

if ((process.argv.length == 3) && process.argv[2] == "backup") {
  backupUsers ();
}

if ((process.argv.length == 3) && process.argv[2] == "restore") {
  reestoreUsers ();
}
