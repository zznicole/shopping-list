const crypto = require('crypto');
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

function generateVerificationCode()
{
  verificationCode = crypto.randomBytes(8).toString('hex');
  return verificationCode;
}
exports.generateVerificationCode = generateVerificationCode;

function matchVerificationCode(usersCode, receivedCode)
{
  return usersCode == receivedCode;
}
exports.matchVerificationCode = matchVerificationCode;

function sendVerificationMessage(userId, email, first_name, verificationCode)
{
  let from = "noreply@ourshoppinglist.online";
  let to = `${email}`;
  let subject =  "Verify your Ourshoppinglist.online account!";
  if (first_name.length == 0) {
    first_name = email;
  }
  let text = `Hi ${first_name},
    
    Welcome to Ourshoppinglist.online! Before you can use the service,
    please click the following link to verify your email address:
    
    ${hostConfig.URL}/verifyuser?userid=${userId}&verificationcode=${verificationCode}`;
  
  let html = `<h1>Hi ${first_name},</h1>
    <p>Welcome to Ourshoppinglist.online! Before you can use the service,<br/>
    please click the following link to verify your email address:</p>
    <p><a href="${hostConfig.URL}/verifyuser?userid=${userId}&verificationcode=${verificationCode}">
    ${hostConfig.URL}/verifyuser?userid=${userId}&verificationcode=${verificationCode}</a></p>`;
  
  if (!testingLocally) {
    emailer.sendMail(from, to, subject, html, text);
  } else {
    console.log("In testing mode, do not send:");
    console.log(from, to, subject, html, text);
  }
}

exports.sendVerificationMessage = sendVerificationMessage;
