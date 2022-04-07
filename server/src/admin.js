const disk = require('diskusage');
const os = require('os');
const user = require('./user.js');
const session = require('./session.js');

function getAllUsers(odb) {
  try {
    let users = [];
    odb.query(users, 'select<User>()');

    return {groups:[
      {heading: "All users", items: users.map(x => (
        
        [{value: x.userId.userId},
          {value: x.userId.screenName, unit: "text"},
          {value: x.permissions.length > 0 ? x.permissions.toString() : "[]", unit: "text"},
          {value: x.lists.length, unit: "count"}
        ]
      ))}
    ]};
  }
  catch (err) {
    console.log(err);
  }
  return {};
}
    
function getAllSessions() {
  try {
    let allSessions = session.allSessions();
    return {groups:[
      {heading: "Sessions", items: Object.keys(allSessions).map(x => (
        [{value: (allSessions[x].user?allSessions[x].user.userId.userId:"unknown")}, 
         {value: allSessions[x].lastAccess, unit: "datetime"}, 
         {value: x}]
      ))}
    ]};
  }
  catch (err) {
    console.log(err);
  }
  return {};
}
function getAllUnverifiedUsers() {
  try {
    let unvUsrs = user.allUnverifiedUsers();
    return {groups:[
      {heading: "Unverified users", items: Object.keys(unvUsrs).map(x => (
        [{value: x}, {value: unvUsrs[x].created, unit: "datetime"}]
      ))}
    ]};
  }
  catch (err) {
    console.log(err);
  }
  return {};
}
    
function getStats(odb) {
  try {
    let numUsers = odb.query('count<UserId>()');
    let numLists = odb.query('count<ShoppingList>()');
    let numItems = odb.query('count<Item>()');
    let diskInfo = disk.checkSync('/');
    let unverifiedInfo = user.numberOfUnverifiedUsers();
    let numSessions = session.numberOfSessions();
    let memUse = {}
    memUse['Node title'] = process.title;
    memUse['Node version'] = process.version;
    memUse = Object.assign(memUse, process.cpuUsage());
    
    let memory = [];
    for (let mi of Object.keys(memUse)) {
      memory.push(
        [{value: mi}, {value: memUse[mi]}]
      );
    }
    memory.push([{value: 'Node uptime'}, {value: process.uptime(), unit: "seconds"}]);
    memUse = process.memoryUsage();
    for (let mi of Object.keys(memUse)) {
      memory.push(
        [{value: mi}, {value: memUse[mi], unit: "bytes"}]
      );
    }
    
    function toMatrix(object) {
      let stats = [];
      for (let key of Object.keys(object)) {
        let unit = "count";
        if (key.includes('_size')) {
          unit = "bytes";
        }
        stats.push(
          [{value: key}, {value: object[key], unit: unit}]
        );
      }
      return stats;
    }
    let cstats = toMatrix(odb.client_stats());
    // let dbstats = toMatrix(odb.db_stats());
    let dbstats = []
    
    return {groups:[
      {heading: "Shopping list objects", 
      items: [
        [{value: "Number of users"}, {value: numUsers, unit: "count"}],
        [{value: "Number of lists"}, {value: numLists, unit: "count"}],
        [{value: "Number of items"}, {value: numItems, unit: "count"}]
      ]},
      {heading: "Shopping list cache", items: [
        [{value: "Number of sessions"}, {value: numSessions, unit: "count"}],
        [{value: "Number of unverified users"}, {value: unverifiedInfo.numberOfUnverifiedUsers, unit: "count"}],
        [{value: "Verification timeout"}, {value: unverifiedInfo.maxNumberOfUnverifiedUsers, unit: "count"}],
        [{value: "Max number of unverified users"}, {value: unverifiedInfo.verificationTimeout, unit: "count"}],
      ]},
      {heading: "DBOO API stats", items: cstats},
      {heading: "DBOO server stats", items: dbstats},
      {heading: "Node.js memory usage", items: memory},
      {heading: "Server disk space", items: [
        [{value: "Space available"}, {value: diskInfo.available, unit: "bytes"}],
        [{value: "Space free"}, {value: diskInfo.free, unit: "bytes"}],
        [{value: "Space total"}, {value: diskInfo.total, unit: "bytes"}],
        [{value: "Space used"}, {value: diskInfo.total - diskInfo.free, unit: "bytes"}]
      ]},
    ]};
  }
  catch (err) {
    console.log(err);
  }
  return {};
}

function getData(odb, itemType) {
  console.log(itemType);
  if (itemType == 'stats') {
    return getStats(odb);
  }
  if (itemType == 'allusers') {
    return getAllUsers(odb);
  }
  if (itemType == 'sessions') {
    return getAllSessions();
  }
  if (itemType == 'unverifiedusers') {
    return getAllUnverifiedUsers();
  }
  return {};
}
exports.getData = getData;
