const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const dboo = require('dboo');
const http = require('http');
const https = require('https');
const fs = require('fs');
var path = require('path');
var parser = require('./src/parser');

const user = require('./src/user.js');
const session = require('./src/session.js');
const config = require('config');
const lists = require('./src/lists.js');
const userid = require('./src/userid.js');

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
  const httpApp = express();
  httpApp.all('*', (req, res) =>
    res.redirect(301, hostConfig.URL));
  let serverHttp = http.createServer(httpApp);
  serverHttp.listen(hostConfig.httpPort, () =>
    console.log(`HTTP server listening on ${hostConfig.httpPort}`)
  );
  
  if (hostConfig.useSSL == false) {
    let serverHttp2 = http.createServer(app).listen(hostConfig.port, () =>
      console.log("HTTPS (API) server listening on port " + hostConfig.port));
  
    return [serverHttp2, serverHttp];
  }
  let serverHttps = https.createServer(sslOptions, app);
  serverHttps.listen(hostConfig.port, () =>
    console.log("HTTPS (API) server listening on port " + hostConfig.port)
    );
  
  return [serverHttps, serverHttp];
}
let server = createServer();


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
  let userid = req.body.userid;
  let password = req.body.password;
  let pwd = user.findUserPassword(odb, userid);
  if (pwd) {
    if (user.passwordMatches(pwd, password)) {
      console.log("User " + userid + " logged in");
      s.user = user.findUser(odb, userid);
      console.log(s.user);
      if (s.user) {
        res.json({sessionId: s.sessionId, code: 200, message: "logged in"});
        return;
      }
    } 
  }
  res.json({sessionId: s.sessionId, code: 401, message: "error logging in"});
});

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
  // Redirect to screen with "successfully verified" message and a button to login screen
  res.json({sessionId: s.sessionId, message: response.message, code: response.code});
});

// TODO: Move to other file? Admin API
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
      for (let i = 0; i < list.items.length && i < 5; ++i) {
        if (i > 0) {
          summary = summary + ", ";
        }
        summary = summary + list.items[i].summary;
      }
      len = summary.length;
      summary = summary.substr(0, 37);
      // Add ellipses (...) at end (unicode \u2026)
      if (len > 37) {
        summary = summary + "\u2026";
      }
      results.push({
        id: odb.objectid(list),
        title: list.summary,
        subtitle: summary,
        isOwn: s.user.userId === list.owner,
        isShared: list.users.length > 0,
        isCompleted: list.done,
        itemCount: list.items.length});
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
    let list = lists.createList(req.body.summary, req.body.description, s.user);
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
        if (list.owner === s.user.userId) {
          // user is list owner
          // TODO: If a list is shared, if we don't remove the list from the other users it is still going to
          // be available for them. Should that be the case?
          // Maybe the owner should always be forced to remove the users the list is shared with before removing the list.
        } else {
          // user has this list as a shared list, remove from users field:
          for (let k = 0; k < list.users.length; ++k) {
            let uid = list.users[k];
            if (uid.userId === s.user.userId) {
              list.users.splice(k, 1);
              break;
            }
          }
        }
        odb.commit([s.user, list]);
        break;
      }
    }
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
    results = {
      listid: req.query.listid,
      summary: list.summary,
      isOwn: s.user.userId === list.owner,
      isShared: list.users.length > 0,
      items: items };
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
  console.log('sharelist');
  console.log(req.body);
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.body.listid);
    // Only owner can share
    console.log("List owner: " + list.owner.userId);
    console.log("User: " + s.user.userId.userId);
    if (list.owner === s.user.userId) {
      let otherUserId = req.body.userid;
      // Can't share with one self:
      if (list.owner.userId == otherUserId) {
        res.json({code: 404, message: "Cannot share with yourself"});
        console.log("Cannot share with yourself");
        return;
      }
      if (list.users.find(usrId => usrId.userId == otherUserId) ) {
        res.json({code: 404, message: "List is already shared with user"});
        console.log("List is already shared with user");
        return;
      }
  
      let otherUser = user.findUser(odb, otherUserId);
      if (otherUser) {
        list.users.push(otherUser.userId);
        if (otherUser.lists.find(item => item === list) == undefined) {
          otherUser.lists.push(list);
        }
        odb.commit([otherUser, list]);
  
        res.json({code: 200, message: list.description + " shared with " + otherUserId});
        console.log(list.description + " shared with " + otherUserId);
      } else {
        res.json({code: 200, message: otherUserId + " not found!"});
        console.log( otherUserId + " not found!");
      }
    } else {
      res.json({code: 404, message: "User ('" +  s.user.userId.userId + "') is not the owner"});
      console.log("User ('" +  s.user.userId.userId + "') is not the owner");
    }
  } else {
    res.json({code: 401, message: "no access"});
    console.log("no access");
  }
});

app.get('/getshares', async function(req, res) {
  console.log('getshares');
  console.log(req.query);
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.query.listid);
    // Only owner can see shares
    if (list.owner == s.user.userId) {
      items = [];
      for (let usr of list.users) {
        items.push({itemid: odb.objectid(usr), title: usr.userId});
      }
      results = {listid: req.query.listid, items: items };
      res.json({sessionId: s.sessionId, code: 200, result: results});
      console.log(results);
  
    } else {
      res.json({sessionId: s.sessionId, code: 404, message: "User is not owner of list"});
    }
  } else {
    res.json({sessionId: s.sessionId, code: 401, message: "no access"});
  }
});


app.post('/rmshare', async function(req, res) {
  console.log('rmshare');
  console.log(req.body);
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.body.listid);
    // Only owner can share
    console.log("List owner: " + list.owner.userId);
    console.log("User: " + s.user.userId.userId);
    if (list.owner === s.user.userId) {
      let otherUserId = odb.object(req.body.userid);
      // Can't remove yourself:
      if (list.owner === otherUserId) {
        res.json({code: 404, message: "Cannot remove yourself"});
        console.log("Cannot remove yourself");
        return;
      }
      if (list.users.find(usrId => usrId === otherUserId) == undefined) {
        res.json({code: 404, message: "List is not shared with user"});
        console.log("List is not shared with user");
        return;
      }
      
      let otherUser = user.findUser(odb, otherUserId.userId);
      if (otherUser) {
        for (let i = 0; i < otherUser.lists.length; ++i) {
          if (otherUser.lists[i] === list) {
            otherUser.lists.splice(i, 1);
            break;
          }
        }
        // user has this list as a shared list, remove from users field:
        for (let k = 0; k < list.users.length; ++k) {
          let uid = list.users[k];
          if (uid === otherUser.userId) {
            list.users.splice(k, 1);
            break;
          }
        }
        odb.commit([otherUser, list]);
        
        res.json({code: 200, message: list.description + " shared with " + otherUserId});
        console.log(list.description + " shared with " + otherUserId.userId);
      } else {
        res.json({code: 200, message: otherUserId + " not found!"});
        console.log( otherUserId + " not found!");
      }
    } else {
      res.json({code: 404, message: "User ('" +  s.user.userId.userId + "') is not the owner"});
      console.log("User ('" +  s.user.userId.userId + "') is not the owner");
    }
  } else {
    res.json({code: 401, message: "no access"});
    console.log("no access");
  }
});


app.get('*', (req,res) =>{
  res.sendFile(path.join(path.dirname(__dirname), 'client/build/index.html'));
});
