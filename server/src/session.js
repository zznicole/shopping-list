const crypto = require('crypto');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// class Session
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Session
{
  user; // Points to user object if logged in
  sessionId;
  ipAddress;
  lastAccess;
  keepLoggedIn;
  
  constructor(userIP) {
    this.sessionId = crypto.randomBytes(16).toString('hex');
    this.ipAddress = userIP;
    this.lastAccess = Date.now();
    this.keepLoggedIn = false;
  }
};

function newSession(userIP) {
  return new Session(userIP);
}

// Maps session id => session
let sessions = {};
// Maps user id => sessions
let sessionByUserId = {};

function allSessions() {
  return sessions;
}
function numberOfSessions() {
  return Object.keys(sessions).length;
}
function remoteIp(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}
const sessionTimeout = 15 * 60 * 1000; // 15 minutes as milli seconds
const keepLoggedInTimeout = 7 * 24 * 15 * 60 * 1000; // 7 days as milli seconds

function handleSession(req, res) {
  let sessionid = req.cookies.sessionId;
  if (!(sessionid === undefined)) {
    // check if we have a sesssion object for this id:
    if (!(sessions[sessionid] === undefined)) {
      let s = sessions[sessionid];
      // Check for timeout here...
      let timeout = sessionTimeout;
      
      if (s.keepLoggedIn) {
        timeout = keepLoggedInTimeout;
      }
      
      let expiryTime = s.lastAccess + timeout
      if (Date.now() < expiryTime) {
        // If now is before expiry time, keep session and return
        res.cookie('sessionId', s.sessionId, { maxAge:timeout, httpsOnly:true});
        s.lastAccess = Date.now();
        return s;
      }
      // Session has expired:
      clearSession(req, res);
    }
  }
  
  // For new sessions, the keepLoggedIn flag will not be set immediately. It will on the second API call though. It
  // is set in '/login' handler after login has been confirmed.
  s = newSession(remoteIp(req));
  sessions[s.sessionId] = s;
  s.lastAccess = Date.now();
  res.cookie('sessionId', s.sessionId, { maxAge:900000, httpsOnly:true});
  res.clearCookie('loggedIn');
  return s;
}

function clearSession(req, res) {
  let sessionid = req.cookies.sessionId;
  if (!(sessionid === undefined)) {
    let s = sessions[sessionid];
    if (sessionByUserId.hasOwnProperty(user.userId)) {
      let sessionsForUser = sessionByUserId[s.user.userId];
      for (let i = 0; i < sessionsForUser.length; ++i) {
        delete sessionsForUser[i];
      }
    }
    delete sessions[sessionid];
    res.clearCookie('sessionId');
    res.clearCookie('loggedIn');
  }
}

function setSessionUser(session, user, keepLoggedIn) {
  session.user = user;
  session.keepLoggedIn = keepLoggedIn;
  let uid = user.userId.userId;
  if (sessionByUserId.hasOwnProperty(uid)) {
    sessionByUserId[uid].push(session);
  } else {
    sessionByUserId[uid] = [session];
  }
  console.log("setSessionUser: " + uid);
  for (let s of sessionByUserId[uid]) {
    console.log(s.sessionId);
  }
}

function clearAllSessionsForUser(req, res, uid) {
  let sessionid = req.cookies.sessionId;
  try {
    if (!(sessionid === undefined)) {
      let s = sessions.hasOwnProperty(sessionid) && sessions[sessionid];
      if (s) {
        let user = s.user;
        if (uid === undefined && user.userId) {
          uid = user.userId.userId;
        }
        if (uid && sessionByUserId.hasOwnProperty(uid)) {
          let allUserSessions = sessionByUserId[uid];
          for (let s of allUserSessions) {
            delete sessions[s.sessionId];
          }
          delete sessionByUserId[uid];
        }
      }
    }
  } catch (e) {
    console.log("Exception clearing session id: ", e);
  }
  
  res.clearCookie('sessionId');
  res.clearCookie('loggedIn');
}


exports.clearSession = clearSession;
exports.handleSession = handleSession;
exports.setSessionUser = setSessionUser;
exports.clearAllSessionsForUser = clearAllSessionsForUser;
exports.numberOfSessions = numberOfSessions;
exports.allSessions = allSessions;

function getAllSessions() {
  return sessions;
}

exports.getAllSessions = getAllSessions;