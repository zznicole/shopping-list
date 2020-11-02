// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the regions
AWS.config.loadFromPath('./config/ses_emailer_credentials.json');

function sendMail(from, to, subject, html, text) {
  console.log("sendMail:");
  console.log(from);
  console.log(to);
  console.log(subject);
  console.log(html);
  console.log(text);

  var params = {
    Destination: {
      // CcAddresses: [],
      ToAddresses: [
        `${to}`
      ]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html.toString()
        },
        Text: {
          Charset: "UTF-8",
          Data: text.toString()
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject.toString()
      }
    },
    Source: `${from}`,
    ReplyToAddresses: [
      `${from}`
    ],
  };
  
  console.log("Sending verification link to: " + to + ", using AWS SES.");
  console.log(params);

  var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

  sendPromise.then(
    function (data) {
      console.log(data.MessageId);
    }).catch(
    function (err) {
      console.error(err, err.stack);
    });
}
exports.sendMail = sendMail;
