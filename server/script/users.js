const dboo = require('dboo');
const config = require('config');
const user = require('../src/user.js');

dbConfig = config.get('dbConfig');

const odb = new dboo.ODB();
odb.connect(dbConfig.host, dbConfig.port, dbConfig.dbName, dbConfig.webUserName, dbConfig.webUserPwd);

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
