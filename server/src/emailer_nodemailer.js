const nodemailer = require('nodemailer');
const config = require('config');
emailConfig = config.get('emailConfig');

let transporter = nodemailer.createTransport(emailConfig.smtp);

function sendMail(from, to, subject, html, text)
{
  let message = {
    from: `${from}`,
    to: `${to}`,
    subject: `${subject}`,
    text: `${text}`,
    html: `${html}`
  };
  console.log("Sending verification link to: " + to);
  console.log(message);
  transporter.sendMail(message);
}

exports.sendMail = sendMail;
