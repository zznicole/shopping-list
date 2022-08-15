const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('config');
hostConfig = config.get('hostConfig');
env = config.get('env');

let testingLocally = false;
if (env.testing && env.testing === true) {
  testingLocally = true;
}
let emailer = {};

if (testingLocally) {

} else {
  if (true) {
    emailer = require('./emailer_ses');
  } else {
    emailer = require('./emailer_nodemailer');
  }
  
}

let LOGINTOKEN_SECRET = crypto.randomBytes(256).toString('hex');

function generateLoginToken(userId, keepLoggedIn)
{
  return jwt.sign({
    uid: userId,
    keepLoggedIn: keepLoggedIn
  }, LOGINTOKEN_SECRET, { expiresIn: '1h' });
}
exports.generateLoginToken = generateLoginToken;

function verifyToken(token)
{
  try {
    let decoded = jwt.verify(token, LOGINTOKEN_SECRET);
    return decoded;
  } catch (e) {
    console.log("Verifying login link failed: ", e);
  }
  return false;
}
exports.verifyToken = verifyToken;

function sendLoginMessage(userId, email, first_name, keepLoggedIn)
{
  console.log("sendLoginMessage");
  let from = "noreply@ourshoppinglist.online";
  let to = `${email}`;
  let subject =  "Login link for your Ourshoppinglist.online account!";
  if (first_name.length == 0) {
    first_name = email;
  }
  let loginToken = generateLoginToken(userId);
  
  let text = `Hi ${first_name},
    
    Click below link to log in:
    
    ${hostConfig.URL}/login?token=${loginToken}
    
    Link is valid for 1 hour.
    `;
  
  let html = `<h1>Hi ${first_name},</h1>
    <p>Click below link to log in:</p>
    <p><a href="${hostConfig.URL}/login?token=${loginToken}">
    ${hostConfig.URL}/login?token=${loginToken}</a></p>
    <p>Link is valid for 1 hour.</p>`;
  
  if (!testingLocally) {
    emailer.sendMail(from, to, subject, html, text);
  } else {
    console.log("In testing mode, do not send:");
    console.log(from, to, subject, html, text);
  }
}

exports.sendLoginMessage = sendLoginMessage;
