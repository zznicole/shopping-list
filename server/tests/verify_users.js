var imaps = require('imap-simple');
var config = require('config');
var emailConfig = config.get('emailConfig');
const fetch = require('node-fetch');
const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

var config = {
    imap: {
        user: emailConfig.imap.user,
        password: emailConfig.imap.password,
        host: emailConfig.imap.host,
        port: emailConfig.imap.port,
        starttls: true
    }
};


function find_verification_email_and_respond() {
  
  imaps.connect(config).then(function (connection) {        
      connection.openBox('INBOX').then(function () {
    
          var searchCriteria = ['ALL'];
          var fetchOptions = { bodies: ['TEXT'], struct: true };
          return connection.search(searchCriteria, fetchOptions);
 
      //Loop over each message
      }).then(function (messages) {
          let taskList = messages.map(function (message) {
              return new Promise((res, rej) => {
                  var parts = imaps.getParts(message.attributes.struct); 
                  parts.map(function (part) {
                      return connection.getPartData(message, part)
                      .then(function (partData) {
                        
                          //Display e-mail body
                          if (part.disposition == null && part.encoding != "base64"){
                            var href = partData.match(/href="([^"]*)/)[1];
                                console.log(href);  
                                const test2_VerifyUser = async () => {
                                  url = href;
                                  console.log(url);
                                  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

                                  const response = await fetch(url, {agent:httpsAgent});
                                  const json = await response.json(); 
                                  console.log(json);
                                }
                                test2_VerifyUser();  
                          }
 
                          //Mark message for deletion
                          connection.addFlags(message.attributes.uid, "\Deleted", (err) => {
                              if (err){
                                  console.log('Problem marking message for deletion');
                                  rej(err);
                              }
 
                              res(); //Final resolve
                          })
                      });
                  });
              });    
          })
 
          return Promise.all(taskList).then(() => {
              connection.imap.closeBox(true, (err) => { //Pass in false to avoid delete-flagged messages being removed
                  if (err){
                      console.log(err);
                  }
              });
              connection.end();
          });
      });
  });

}

find_verification_email_and_respond();
