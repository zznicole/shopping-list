const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const dboo = require('dboo.node');
const https = require('https');
const fs = require('fs');
var cookieParser = require('cookie-parser')

const user = require('./src/user.js');
const session = require('./src/session.js');
const config = require('config');


dbConfig = config.get('dbConfig');
hostConfig = config.get('hostConfig');

const odb = new dboo.ODB();
odb.connect(dbConfig.host, dbConfig.port, dbConfig.dbName, dbConfig.webUserName, dbConfig.webUserPwd);

let app = express();
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let sslOptions = {
   key: fs.readFileSync('./certs/selfsigned.key'),
   cert: fs.readFileSync('./certs/selfsigned.crt')
};

let serverHttps = https.createServer(sslOptions, app).listen(hostConfig.port);
console.log("Listening to port " + hostConfig.port)

app.use('/', express.static('../client/build/'))
app.use('/static', express.static('../client/build/static'))

// Function to handle the root path
app.get('/', async function(req, res) {
  s = session.handleSession(req, res);
  res.json({sessionId: s.sessionId});
});

app.get('/newsession', async function(req, res) {
  s = session.handleSession(req, res);
  res.json({sessionId: s.sessionId});
});

app.post('/login', async function(req, res) {
  console.log(req.body);
  s = session.handleSession(req, res);
  let upwd = [];
  let userid = req.body.userid;
  let password = req.body.password;
  odb.query(upwd, "select<UserPassword>(eq(userId, \"" + dboo.escape_string(userid) + "\"))");
  if (upwd.length == 1) {
    if (user.passwordMatches(upwd[0], password)) {
      console.log("User " + userid + " logged in");
      let users = [];
      odb.query(users, "select<User>(eq(userId, \"" + dboo.escape_string(userid) + "\"))");
      if (users.length == 1) {
        s.user = users[0];
        res.json({sessionId: s.sessionId, code: 200, message: "logged in"});
        return;
      }
    } 
  }
  res.json({sessionId: s.sessionId, code: 401, message: "error logging in"});
});

app.post('/signup', async function(req, res) {
  s = session.handleSession(req, res);
  let response = user.createUser(req.body.userid,
                  req.body.email,
                  req.body.first_name, 
                  req.body.last_name,
                  req.body.password, 
                  odb);
  res.json({sessionId: s.sessionId, code: response.code, message: response.message});
});

app.get('/verifyuser', async function(req, res) {
  s = session.handleSession(req, res);
  response = user.verifyUser(req.query.userid,
                  req.query.verificationcode,
                  odb);
  res.json({sessionId: s.sessionId, message: response.message, code: response.code});
});

app.get('/listusers', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user && s.user.isAdmin()) {
    users = [];
    odb.query(users, "select<User>()");
    res.json({sessionId: s.sessionId, code: 200, result: users});
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});

app.get('/listsessions', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user && s.user.isAdmin()) {
    let allSessions = session.getSessions();
    res.json({sessionId: s.sessionId, code: 200, result: allSessions});
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});

app.get('/userlists', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    results = [];
    for (list of s.user.lists) {
      results.push({id: odb.objectid(list), summary: list.summary, itemcount: list.items.length});
    }
    res.json({sessionId: s.sessionId, code: 200, result: results});
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});

app.post('/createlist', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    let list = lists.createList(req.body.summary, req.body.description);
    s.user.lists.push(list);
    odb.commit([s.user, list]);
    results = {listid: odb.objectid(list), summary: list.summary, itemcount: list.items.length };
    res.json({sessionId: s.sessionId, code: 200, result: results});
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});

app.get('/getlist', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.query.listid);
    results = {listid: req.query.listid, list: list };
    res.json({sessionId: s.sessionId, code: 200, result: results});
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});

app.post('/newitem', async function(req, res) {
  s = session.handleSession(reqreq, res);
  if (s.user) {
    let list = odb.object(req.body.listid);
    let item = lists.createItem(req.body.summary, req.body.description);
    let itemid = odb.objectid(item);
    results = {listid: req.body.listid, list: list};
    res.json({sessionId: s.sessionId, code: 200, listId: req.body.listid, list: list, newItemId: itemid});
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});

app.get('/sharelist', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.query.listid);
    let otherUserId = odb.object(req.query.userId);
    let otherUser = users.findUser(otherUserId);
    if (otherUser) {
      otherUser.lists.push(list);
      odb.commit(otherUser);
      res.json({sessionId: s.sessionId, code: 200, message: list.description + " shared with " + otherUserId});
    } else {
      res.json({sessionId: s.sessionId, code: 404, message: "Other user ('" + otherUserId + "') not found"});
    }
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});

