const dboo = require('dboo');
const crypto = require('crypto');
const verification = require('./verification.js');
const lists = require('./lists.js');
const userid = require('./userid.js');
const moment = require('moment')

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// class User
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const admin = "admin";
exports.admin = admin;

class User {
  userId = null;
  emailAddress = "";
  mobileNumber = "";
  firstName = "";
  lastName = "";
  permissions = [];
  lists = [];
  preferred_locale = "";
  
  constructor() {
    this.userId = null;
    this.emailAddress = "";
    this.firstName = "";
    this.lastName = "";
    this.permissions = [];
    this.lists = [];
    this.preferred_locale = "";
  }
  
  isAdmin() {
    return this.permissions.includes(admin);
  }
};

exports.User = User;

dboo.class(User,
  [{"userId": userid.UserId},
   {"emailAddress": dboo.string},
   {"firstName": dboo.string},
   {"lastName": dboo.string},
   {"permissions": dboo.array(dboo.string)},
   {"lists": dboo.array(lists.ShoppingList)},
   {"preferred_locale": dboo.string},
  ]
);


function newUser(userid, emailaddress, first_name, last_name) {
  let user = new User();
  user.userId = userid;
  user.emailAddress = emailaddress;
  user.firstName = first_name;
  user.lastName = last_name;
  return user;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// class UserPassword
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class UserPassword {
  userId = null;
  passwordHash = "";
  salt = "";
  iterations = 12317;

  constructor() {
  }
};
exports.UserPassword = UserPassword;

dboo.class(UserPassword,
  [{"userId": userid.UserId},
   {"passwordHash": dboo.string},
   {"salt": dboo.string},
   {"iterations": dboo.int64}]
);

function newUserPassword(userId, clearTextPassword) {
  upwd = new UserPassword();
  upwd.userId = userId;
  upwd.salt = crypto.randomBytes(128).toString('base64');
  upwd.passwordHash = crypto.pbkdf2Sync(clearTextPassword, upwd.salt, upwd.iterations, 512, 'sha512').toString('hex'); 
  return upwd;
}

function passwordMatches(upwd, clearTextPasswordAttempt) {
  let pwd = crypto.pbkdf2Sync(clearTextPasswordAttempt, upwd.salt, upwd.iterations, 512, 'sha512').toString('hex');
  return upwd.passwordHash == pwd;
}
exports.passwordMatches = passwordMatches;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// When creating a user it will first reside in an in-memory map only. A verification email is sent and once
/// the link in the email is pressed, the account is confirmed and stored in database.
/// A maximum number of unverified users can exist and they are always purged after verificationTimeout.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let unverifiedUsers = {};
let maxNumberOfUnverifiedUsers = 100;
let verificationTimeout = { timeout: 60, unit: "minutes"};

function createUser(userName, email, first_name, last_name, password, odb)
{
  console.log('Create user')
  purgeOldUnverifiedUsers();
  let numberOfUnverifiedUsers = Object.keys(unverifiedUsers).length;
  if (numberOfUnverifiedUsers < maxNumberOfUnverifiedUsers) {
    
    if (Object.keys(unverifiedUsers).includes(userName)) {
      return {code: 409, message: "User id " + userName + " already taken! (1)"};
    }
    if (odb.query("count<UserId>(eq(userId, \"" + dboo.escape_string(userName) + "\"))") > 0) {
      return {code: 409, message: "User id " + userName + " already taken! (2)"};
    }
    
    console.log("Create user: " + userName + ", " + email + ", " + first_name + ", " + last_name);
    let verificationCode = verification.generateVerificationCode();
    let userId = new userid.UserId(userName, first_name + " " + last_name);
    unverifiedUsers[userName] = {
      user: newUser(userId, email, first_name, last_name),
      userpwd: newUserPassword(userId, password),
      verificationCode: verificationCode,
      created: moment()
    };
    verification.sendVerificationMessage(userName, email, first_name, verificationCode);
    return {code: 200, message: "User " + userName + " created!"};
  } else {
    console.log("Maximum number of unverified users reached!");
    return {code: 429, message: "Maximum number of unverified users reached!"};
  }
}

exports.createUser = createUser;

function verifyUser(userName, receivedVerificationCode, odb)
{
  let verified = false;
  let u = unverifiedUsers[userName];
  if (!(u === undefined)) {
    if (verification.matchVerificationCode(u.verificationCode, receivedVerificationCode)) {
      verified = true;
    } else {
      console.log("verifyUser: verification code not matching for " + u.user.userId + 
                  ": stored code: " + u.verificationCode + " received code:" + receivedVerificationCode);
      return {message:"Verification failed", code: 401};
    }
  } else {
    console.log("verifyUser: user '" + userId + "' not found, expired?");
    return {message:"Unknown user: " + userId, code: 404};
  }
  if (verified) {
    console.log("verifyUser:" + u.user.userId + ", " + u.user.emailAddress + ", " + u.user.mobileNumber);
    odb.commit([u.user, u.userpwd]);
    delete unverifiedUsers[userName];
    return {message:"User successfully verified", code: 200};
  }
  purgeOldUnverifiedUsers();
}
exports.verifyUser = verifyUser;

function findUser(odb, userName) {
  users = [];
  console.log(     "select<User>(in(userId, select<UserId>(eq(userId, '" + dboo.escape_string(userName) + "'))))");
  odb.query(users, "select<User>(in(userId, select<UserId>(eq(userId, '" + dboo.escape_string(userName) + "'))))");
  if (users.length == 1) {
    let usr = users[0];
    return usr;
  }
  if (users.length = 0) {
    console.log("User " + userId + " not found!");
  }
  if (users.length > 1) {
    console.log("Multiple user " + userId + " found!");
  }
  return false;
}
exports.findUser = findUser;

function findUserPassword(odb, userName) {
  users = [];
  console.log("select<UserPassword>(in(userId, select<UserId>(eq(userId, '" + dboo.escape_string(userName) + "'))))");
  odb.query(users, "select<UserPassword>(in(userId, select<UserId>(eq(userId, '" + dboo.escape_string(userName) + "'))))");
  if (users.length == 1) {
    let upwd = users[0];
    return upwd;
  }
  if (users.length = 0) {
    console.log("User " + userId + " not found!");
  }
  if (users.length > 1) {
    console.log("Multiple user " + userId + " found!");
  }
  return false;
}
exports.findUserPassword = findUserPassword;

function purgeOldUnverifiedUsers() 
{
  let usersToDelete = [];
  let now = moment();
  for (const uid of Object.keys(unverifiedUsers)) {
    let u = unverifiedUsers[uid];
    dt = now.diff(u.created, verificationTimeout.unit);
    if (dt > verificationTimeout.timeout) {
      usersToDelete.push(uid);
    }
  }
  for (const uid of usersToDelete) {
    delete unverifiedUsers[uid];
  }
}
