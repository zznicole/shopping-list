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
  
  constructor(userIP) {
    this.sessionId = crypto.randomBytes(16).toString('hex');
    this.ipAddress = userIP;
    this.lastAccess = Date.now();
  }
};

function newSession(userIP) {
  return new Session(userIP);
}

let sessions = {};

function remoteIp(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

function handleSession(req, res) {
  sessionid = req.cookies.sessionId;
  if (!(sessionid === undefined)) {
    // check if we have a sesssion object for this id:
    if (!(sessions[sessionid] === undefined)) {
      s = sessions[sessionid];
      if (s.ipAddress == remoteIp(req)) {
        // Check for timeout here...
        // if (s.lastAccess )
        s.lastAccess = Date.now();
        res.cookie('sessionId', s.sessionId, { maxAge:900000, httpsOnly:true});
        return s;
      }
    }
  }
  s = newSession(remoteIp(req));
  sessions[s.sessionId] = s;
  res.cookie('sessionId', s.sessionId, { maxAge:900000, httpsOnly:true});
  return s;
}

function clearSession(req, res) {
  delete sessions[sessionid];
}

exports.clearSession = clearSession;
exports.handleSession = handleSession;

function getAllSessions() {
  return sessions;
}

exports.getAllSessions = getAllSessions;