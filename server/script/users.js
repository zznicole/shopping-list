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


function backupUsers() {
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

let classes = new Map([
  ['UserId', userid.UserId],
  ['UserPassword', user.UserPassword],
  ['User', user.User]
]);

function constructObject(className) {
  let cls = classes.get(className);
  return new(cls);
}

function readObject(line) {
  let restored = JSON.parse(line);
  let clsid = restored['dboo::class'];
  let id = restored['dboo::objectid'];
  let no = constructObject(clsid);

  Object.assign(no, restored);
  odb.setid(no, id);
  console.log(`${clsid} ${id}: `);
  console.log(no);
  return [id, no];
}

function resolvePointers(objectMap, object) {
  for (let key in object) {
    if (key != 'dboo::objectid') {
      let value = object[key];
      if (typeof value == 'string' && value.length == 16) {
        let id = value;
        // potential object id
        if (objectMap.has(id)) {
          console.log(`resolved ${key}, id ${id}`);
          object[key] = objectMap.get(id);
        }
      } else if (value instanceof Array) {
        let arr = value;
        for (let i = 0; i < arr.length; ++i) {
          let value = arr[i];
          if (typeof value == 'string' && value.length == 16) {
            let id = value;
            // potential object id
            if (objectMap.has(id)) {
              console.log(`resolved ${key}[${i}], id ${id}`);
              arr[i] = objectMap.get(id);
            }
          }
        }
      }
    }
  }
}

function restoreUsers() {
  const start = async() => {
    let objectMap = new Map();
    let objectArray = [];

    let lineReader = readline.createInterface({
      input: fs.createReadStream('userid.json')
    });
    for await (const line of lineReader) {
      let obj = readObject(line);
      objectMap.set(obj[0], obj[1]);
      objectArray.push(obj[1]);
    }

    lineReader = readline.createInterface({
      input: fs.createReadStream('userpwd.json')
    });
    for await (const line of lineReader) {
      let obj = readObject(line);
      objectMap.set(obj[0], obj[1]);
      objectArray.push(obj[1]);
    }

    lineReader = readline.createInterface({
      input: fs.createReadStream('users.json')
    });
    for await (const line of lineReader) {
      let obj = readObject(line);
      objectMap.set(obj[0], obj[1]);
      objectArray.push(obj[1]);
    }

    for (let obj of objectArray) {
      resolvePointers(objectMap, obj);
      console.log(obj);
    }
    odb.commit(objectArray);
  }
  start();
}

function makeUserAdmin(userId) {
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
  makeUserAdmin(process.argv[3]);
}

if ((process.argv.length == 3) && process.argv[2] == "backup") {
  backupUsers();
}

if ((process.argv.length == 3) && process.argv[2] == "restore") {
  restoreUsers();
}
