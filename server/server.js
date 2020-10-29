const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const dboo = require('dboo');
const https = require('https');
const fs = require('fs');
var path = require('path');
var parser = require('./src/parser');

const user = require('./src/user.js');
const session = require('./src/session.js');
const config = require('config');
const lists = require('./src/lists');

dbConfig = config.get('dbConfig');
hostConfig = config.get('hostConfig');
sslConfig = config.get('ssl');

const odb = new dboo.ODB();
odb.connect(dbConfig.host, dbConfig.port, dbConfig.dbName, dbConfig.webUserName, dbConfig.webUserPwd);

parser.init(odb);

let categories = [];
let defaultCategory;
odb.query(categories, "select<Category>(eq(summary,'default'))");
if (categories.length == 0) {
  defaultCategory = lists.createCategory("default");
  odb.commit(defaultCategory);
} else {
  defaultCategory = categories[0];
}

let app = express();
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let sslOptions = {
   key: fs.readFileSync(sslConfig.key),
   cert: fs.readFileSync(sslConfig.cert)
};

function createServer() {
  if (hostConfig.useSSL == false) {
    const http = require('http');
    let serverHttp = http.createServer(app).listen(hostConfig.port);
  
    return serverHttp;
  }
  let serverHttps = https.createServer(sslOptions, app).listen(hostConfig.port);
  return serverHttps;
}
let server = createServer();
console.log("Listening to port " + hostConfig.port)

app.use('/static', express.static('../client/build/static'))
app.use('/', express.static('../client/build/'))

// Function to handle the root path
// app.get('/', async function(req, res) {
//   s = session.handleSession(req, res);
//   res.json({sessionId: s.sessionId});
// });

app.get('/newsession', async function(req, res) {
  s = session.handleSession(req, res);
  res.json({sessionId: s.sessionId});
});

app.get('/logout', async function(req, res) {
  session.clearSession(req, res);
});

app.post('/login', async function(req, res) {
  console.log(req.body);
  let s = session.handleSession(req, res);
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

function listUsers(usr)
{
  let userid = usr.userId;
  let users = [];
  odb.query(users, "select<User>(eq(userId, \"" + dboo.escape_string(userid) + "\"))");
  if (users.length > 1) {
    console.log("*******************************************************************");
    console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
  }
  for (let u of users) {
    console.log(odb.objectid(u));
    console.log(u);
  }
  if (users.length > 1) {
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    console.log("*******************************************************************");
  }
}

app.post('/signup', async function(req, res) {
  console.log(req.body);
  let s = session.handleSession(req, res);
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
  console.log(req.body);
  let s = session.handleSession(req, res);
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
  let s = session.handleSession(req, res);
  if (s.user) {
    results = [];
    for (let list of s.user.lists) {
      let summary = "";
      for (let i = 0; i < list.items.length && i < 10; ++i) {
        if (i > 0) {
          summary = summary + ", ";
        }
        summary = summary + list.items[i].summary;
      }
      results.push({id: odb.objectid(list), title: list.summary, subtitle: summary, isCompleted: list.done, itemcount: list.items.length});
    }
    res.json({sessionId: s.sessionId, code: 200, result: results});
    res.status(200);
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
    res.status(401);
  }
});

app.post('/createlist', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    let list = lists.createList(req.body.summary, req.body.description);
    s.user.lists.push(list);
    let a = [s.user, list];
    odb.commit(a);
    results = {listid: odb.objectid(list), summary: list.summary, itemcount: list.items.length };
    res.json({sessionId: s.sessionId, code: 200, result: results});
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});

app.post('/rmlist', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    listidToRemove = req.body.listid;
    for (let i = 0; i < s.user.lists.length; ++i) {
      let list = s.user.lists[i];
      if (odb.objectid(list) == listidToRemove) {
        s.user.lists.splice(i, 1);
        break;
      }
    }
    odb.commit([s.user]);
    res.json({sessionId: s.sessionId, code: 200});
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});

app.get('/getlist', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.query.listid);
    let items = [];
    for (let item of list.items) {
      items.push({itemid: odb.objectid(item), title: item.summary, isCompleted: item.done});
    }
    results = {listid: req.query.listid, summary: list.summary, items: items };
    res.json({sessionId: s.sessionId, code: 200, result: results});
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});

app.post('/editlist', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.query.listid);
    list.summary = req.body.title;
    list.description = "";
    list.done = req.body.isCompleted;
    odb.commit(item);
    
    res.json({code: 200, itemid: itemid});
  } else {
    res.json({code: 401, message: "no access"});
  }
});

app.post('/newitem', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.body.listid);
    lists.createItems(req.body.summary, req.body.description, defaultCategory,
    function (items) {
      if (items.length > 0) {
        for (let item of items) {
          list.items.push(item);
        }
        items.push(list);
        odb.commit(items);
      }});
      res.json({code: 200});
    } else {
      res.json({code: 401, message: "no access"});
    }
});

app.post('/rmitem', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    console.log("/rmitem: ");
    console.log(req.body);
    let list = odb.object(req.body.listid);
    let item = odb.object(req.body.itemid);
    for (let i = 0; i < list.items.length; ++i) {
      if (item === list.items[i]) {
        list.items.splice(i, 1);
        break;
      }
    }
    odb.commit(list);
    res.json({code: 200});
  } else {
    res.json({code: 401, message: "no access"});
  }
});

app.post('/edititem', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    let item = odb.object(req.body.itemid);
    item.summary = req.body.summary;
    item.description = "";
    item.done = req.body.isCompleted;
    odb.commit(item);

    res.json({code: 200, itemid: req.body.itemid});
  } else {
    res.json({code: 401, message: "no access"});
  }
});

app.post('/sharelist', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.body.listid);
    let otherUserId = odb.object(req.body.userid);
    let otherUser = users.findUser(otherUserId);
    if (otherUser) {
      otherUser.lists.push(list);
      odb.commit(otherUser);
      res.json({sessionId: s.sessionId, code: 200, message: list.description + " shared with " + otherUserId});
    } else {
      res.json({sessionId: s.sessionId, code: 404, message: "User ('" + otherUserId + "') not found"});
    }
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});

app.post('/createList', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.body.listid);
    let otherUserId = odb.object(req.body.userid);
    let otherUser = users.findUser(otherUserId);
    if (otherUser) {
      otherUser.lists.push(list);
      odb.commit(otherUser);
      res.json({sessionId: s.sessionId, code: 200, message: list.description + " shared with " + otherUserId});
    } else {
      res.json({sessionId: s.sessionId, code: 404, message: "User ('" + otherUserId + "') not found"});
    }
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});


app.get('*', (req,res) =>{
  res.sendFile(path.join(path.dirname(__dirname), 'client/build/index.html'));
});
