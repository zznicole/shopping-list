console.log("Environment: " + process.env.NODE_ENV);

const dboo = require('dboo');
// check for debugging args on command line before any dboo things happen:
// possible options: --log_object_ids, --log_rt_class_ids, --log_rt_serializer_ids
dboo.argv(process.argv);

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const parser = require('./src/parser');
const aggregator = require('./src/aggregator');

const user = require('./src/user.js');
const session = require('./src/session.js');
const config = require('config');
const lists = require('./src/lists.js');
const userid = require('./src/userid.js');
const admin = require('./src/admin.js');

dbConfig = config.get('dbConfig');
hostConfig = config.get('hostConfig');
sslConfig = config.get('ssl');

dboo.init();

console.log("Database details");
console.log("db host: " + dbConfig.host);
console.log("db port: " + dbConfig.port);
console.log("db name: " + dbConfig.dbName);
console.log("db user: " + dbConfig.webUserName);

const odb = new dboo.ODB();
odb.connect(dbConfig.host, Number(dbConfig.port), dbConfig.dbName, dbConfig.webUserName, dbConfig.webUserPwd);

parser.init(odb);
aggregator.init(odb);

let categories = [];
let defaultCategory;
odb.query(categories, "select<Category>(eq(summary,'Other'))");
if (categories.length == 0) {
  defaultCategory = lists.createCategory("Other");
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
});

app.get('/logout', async function(req, res) {
  session.clearAllSessionsForUser(req, res);
});

app.post('/login', async function(req, res) {
  let s = session.handleSession(req, res);
  let userid = req.body.userid ? req.body.userid : "";
  let password = req.body.password ? req.body.password : "";
  let keepLoggedIn = req.body.keepLoggedIn ? req.body.keepLoggedIn : false;
  let pwd = user.findUserPassword(odb, userid);
  if (pwd) {
    if (user.passwordMatches(pwd, password)) {
      console.log("User " + userid + " logged in");
      let usr = user.findUser(odb, userid);
      if (usr) {
        session.setSessionUser(s, usr, keepLoggedIn);
        s.keepLoggedIn = keepLoggedIn;
        console.log(s.user);
        res.cookie('loggedIn', true);
        res.json({code: 200, message: "logged in"});
        return;
      }
    } 
  }
  res.status(401);
  res.json({code: 401, message: "error logging in"});
});

app.post('/signup', async function(req, res) {
  let s = session.handleSession(req, res);
  let response = user.createUser(req.body.userid,
                  req.body.email,
                  req.body.first_name, 
                  req.body.last_name,
                  req.body.password, 
                  odb);
  res.json({code: response.code, message: response.message});
});

app.get('/verifyuser', async function(req, res) {
  s = session.handleSession(req, res);
  response = user.verifyUser(req.query.userid,
                  req.query.verificationcode,
                  odb);
  // Redirect to screen with "successfully verified" message and a button to login screen
  if (response.code == 200) {
    res.redirect(303, hostConfig.URL + "/verify/success");
  } else {
    res.redirect(303, hostConfig.URL + "/verify/failure");
  }
});

// TODO: Move to other file? Admin API
app.get('/listsessions', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user && s.user.isAdmin()) {
    let allSessions = session.getSessions();
    res.json({code: 200, result: allSessions});
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
  }
});

app.get('/user', async function(req, res) {
  let s = session.handleSession(req, res);
  if (s.user) {
    results = [s.user.userId];
    res.json({code: 200, result: results});
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
  }
});

app.get('/userlists', async function(req, res) {
  let s = session.handleSession(req, res);
  if (s.user) {
    results = [];
    for (let list of s.user.lists) {
      let summary = "";
      for (let i = 0; i < list.items.length; ++i) {
        if (i > 0) {
          summary = summary + ", ";
        }
        summary = summary + list.items[i].summary;
      }
      let listIsOwn = s.user.userId === list.owner;
      results.push({
        id: odb.objectid(list),
        title: list.summary,
        subtitle: summary,
        isOwn: listIsOwn,
        owner: list.owner,
        isShared: list.users.length > 0,
        shareCount: list.users.length,
        sharedWith: listIsOwn ? list.users : [],
        isCompleted: list.done,
        itemCount: list.items.length});
    }
    res.json({code: 200, result: results});
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
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
    res.json({code: 200, result: results});
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
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
    res.json({code: 200});
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
  }
});

app.get('/mapitems', async function(req, res) {
  console.log('/mapitems');
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.query.listid);
    aggregator.mapAllItems(odb, list);
    console.log(list);
    res.json({code: 200});
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
  }
});


app.get('/aggregatedlist', async function(req, res) {
  console.log('/aggregatedlist');
  s = session.handleSession(req, res);
  if (s.user) {
    // get from query string (from client's browser setting)
    let userLocale = req.query.locale;
    console.log("User locale: " + userLocale);
    // if user has some preferences for this app, use that instead
    if (s.user.preferred_locale && s.user.preferred_locale.length > 0) {
      userLocale = s.user.preferred_locale;
    }
    // figure out language index form user's locale
    let langIx = 0;
    if (userLocale && userLocale > 0) {
      langIx = aggregator.languageIx(s.user.preferred_locale);
    }
    
    let list = odb.object(req.query.listid);
    // Classify all items to category
    aggregator.mapAllItems(odb, list);
    
    let items = new Map();
    // Create a map of lists. The map's key is category 
    // and the mapped list will contain all items for that category 
    for (let item of list.items) {
      let category = item.category;
      if (!category)  {
        category = defaultCategory;
      }
      if (!items.has(category)) {
        items.set(category, []);
      }
      items.get(category).push(item);
      console.log(category.summary + ": " + item.summary);
    }
    
    // Build a list with all categories and items
    let aggregatedList = [];
    for (let category of items.keys()) {
      if (!category) {
        continue;
      }
      subtitle = "";//category.description;
      aggregatedList.push({
        itemid: odb.objectid(category),
        title: category.title(langIx),
        subtitle: subtitle,
        itemType: "header",
        isCompleted: false
      });
      // Sort items based on locale... (TODO: currently based on english as it is index 0)
      let subList = items.get(category);
      subList.sort(function (a,b){
        if (a.itemType && b.itemType) {
          let strA = a.itemType.title(langIx);
          let strB = b.itemType.title(langIx);
          return strA.localeCompare(strB);
        }
        return a.summary.localeCompare(b.summary);
      });
      for (let item of subList) {
        // subtitle here gets some debugging info. (the english name + assigned category)
        let itemtitle = item.summary;
        let subtitle = item.summary;
        if (item.itemType) {
          subtitle = item.itemType.title(langIx);
          console.log("item.itemType: " + itemtitle);
        }
        if (item.category) {
          subtitle += " " + item.category.summary;
        }
        
        aggregatedList.push({
          itemid: odb.objectid(item),
          title: itemtitle,
          subtitle: subtitle,
          itemType: "normal",
          isCompleted: item.done
        });
      }
    }
    let listIsOwn = s.user.userId === list.owner;
    console.log(aggregatedList);
    results = {
      listid: req.query.listid,
      summary: list.summary,
      isCompleted: list.done,
      isOwn: listIsOwn,
      owner: list.owner,
      isShared: list.users.length > 0,
      shareCount: list.users.length,
      sharedWith: listIsOwn ? list.users : [],
      items: aggregatedList,
      aggregated: true
    };
    res.json({code: 200, result: results});
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
  }
});

app.get('/getlist', async function(req, res) {
  console.log('/getlist');
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.query.listid);
    let items = [];
    for (let item of list.items) {
      let subtitle = "";
      if (item.itemType) {
        subtitle += item.itemType.translations[0];
      }
      if (item.category) {
        subtitle += " [" + item.category.summary + "]";
      }
      items.push({
        itemid: odb.objectid(item),
        title: item.summary,
        subtitle: subtitle,
        itemType: "normal ",
        isCompleted: item.done
      });
    }
    let listIsOwn = s.user.userId === list.owner;
    results = {
      listid: req.query.listid,
      summary: list.summary,
      isCompleted: list.done,
      isOwn: listIsOwn,
      owner: list.owner,
      isShared: list.users.length > 0,
      shareCount: list.users.length,
      sharedWith: listIsOwn ? list.users : [],
      items: items,
      aggregated: false };
    res.json({code: 200, result: results});
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
  }
});

app.post('/editlist', async function(req, res) {
  console.log('/editlist');
  console.log(req.body);
  s = session.handleSession(req, res);
  if (s.user) {
    let list = odb.object(req.body.listid);
    list.summary = req.body.summary ? req.body.summary : "";
    list.description = req.body.description ? req.body.description : "";
    list.done = req.body.done ? req.body.done : "";
    odb.commit(list);
    
    res.json({code: 200, list: req.body.listid});
  } else {
    res.status(401);
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
    res.status(401);
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
    res.status(401);
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
    res.status(401);
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
        res.status(403);
        res.json({code: 403, message: "You cannot share with yourself!"});
        console.log("Cannot share with yourself");
        return;
      }
      if (list.users.find(usrId => usrId.userId == otherUserId) ) {
        res.status(403);
        res.json({code: 403, message: "List is already shared with user '" + otherUserId + "'!"});
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
  
        res.json({code: 200, message: list.description + " shared with '" + otherUserId + "'!"});
        console.log(list.description + " shared with " + otherUserId);
      } else {
        res.status(404);
        res.json({code: 404, message: "User '" + otherUserId + "' not found!"});
        console.log( otherUserId + " not found!");
      }
    } else {
      res.status(404);
      res.json({code: 404, message: "User ('" +  s.user.userId.userId + "') is not the owner!"});
      console.log("User ('" +  s.user.userId.userId + "') is not the owner");
    }
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
  }
});

app.get('/admindata', async function(req, res) {
  s = session.handleSession(req, res);
  if (s.user /*&& s.user.isAdmin()*/) {
    console.log("getadmin data");
    let adminPage = admin.getData(odb, req.query.item);
    res.json({code: 200, result: adminPage});
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
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
        items.push({itemid: odb.objectid(usr), 
          title: usr.screenName + " (" + usr.userId + ")", subtitle: usr.userId});
      }
      results = {listid: req.query.listid, items: items };
      res.json({code: 200, result: results});
      console.log(results);
  
    } else {
      res.status(404);
      res.json({code: 404, message: "User is not owner of list"});
    }
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
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
      res.status(404);
      res.json({code: 404, message: "User ('" +  s.user.userId.userId + "') is not the owner"});
      console.log("User ('" +  s.user.userId.userId + "') is not the owner");
    }
  } else {
    res.status(401);
    res.json({code: 401, message: "no access"});
    console.log("no access");
  }
});


app.get('*', (req,res) =>{
  res.sendFile(path.join(path.dirname(__dirname), 'client/build/index.html'));
});
