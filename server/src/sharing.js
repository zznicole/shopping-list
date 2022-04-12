const crypto = require('crypto');
const config = require('config');
hostConfig = config.get('hostConfig');
env = config.get('env');

let testingLocally = false;
if (env.testing && env.testing === true) {
  testingLocally = true;
}
let emailer = {};

if (!testingLocally) {
  if (true) {
    emailer = require('./emailer_ses');
  } else {
    emailer = require('./emailer_nodemailer');
  }
  
}

function send_sharing_email(email, user, listid)
{
  let from = "noreply@ourshoppinglist.online";
  let to = `${email}`;
  first_name = user.firstName;
  if (first_name.length == 0) {
    first_name = email;
  }
  let subject =  first_name + " shared a shopping list!";
  let url = `${hostConfig.URL}/list/${listid}`;
  let text = `Hi,
    
    ${first_name} just shared a shopping list with you:
    
    ${url}`;
  
  let html = `<h1>Hi ${first_name},</h1>
    <p>${first_name} just shared a shopping list with you:</p>
    <p><a href="${url}">${url}</a></p>`;
  if (!testingLocally) {
    emailer.sendMail(from, to, subject, html, text);
  } else {
    console.log("In testing mode, do not send:");
    console.log("from: ", from);
    console.log("to: ", to);
    console.log("subject: ", subject);
    console.log("html: ", html);
    console.log("text: ", text);
  }
  
}

exports.send_sharing_email = send_sharing_email;
