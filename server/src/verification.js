const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const config = require('config');
emailConfig = config.get('emailConfig');
hostConfig = config.get('hostConfig');

console.log(emailConfig.testEmailAddress);

let transporter = nodemailer.createTransport(emailConfig.smtp);

function generateVerificationCode()
{
  verificationCode = crypto.randomBytes(2).toString('hex');
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
  message = {
    from: `"My shopping list" <${emailConfig.testEmailAddress}>`, // sender address
    to: email, // list of receivers
    subject: "Hi, verify your shoppinglist!", // Subject line
    text: `Hi ${first_name},
    
    Welcome to our shopping list! Before you can use the service,
    please click the following link to verify your email address:
    
    ${hostConfig.URL}/verifyuser?userid=${userId}&verificationcode=${verificationCode}`,
    
    html: `<h1>Hi ${first_name},</h1>
    <p>Welcome to our shopping list! Before you can use the service,<br/>
    please click the following link to verify your email address:</p>
    <p><a href="${hostConfig.URL}/verifyuser?userid=${userId}&verificationcode=${verificationCode}">
    ${hostConfig.URL}/verifyuser?userid=${userId}&verificationcode=${verificationCode}</a></p>`
  };
  console.log("Sending verification link to: " + email);
  console.log(message);
  let info = transporter.sendMail(message);
}

exports.sendVerificationMessage = sendVerificationMessage;
