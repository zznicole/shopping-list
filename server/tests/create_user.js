const crypto = require('crypto');
const fetch = require('node-fetch');
const request = require('request');
const config = require('config');
hostConfig = config.get('hostConfig');
emailConfig = config.get('emailConfig');

testdata = {
  userid: "user_" + crypto.randomBytes(4).toString('hex'),
  password: crypto.randomBytes(16).toString('base64'),
  email: emailConfig.testEmailAddress,
  mobile: "+460733285309",
  first_name: "Fred",
  last_name: "Andersson"
};

var sessionId;

// Test 1: Create user
const test1_CreateUser = async () => {
  
  content = {
    userid: testdata.userid,
    email: testdata.email,
    password: testdata.password,
    first_name: testdata.first_name,
    last_name: testdata.last_name,
  };
  postData = {
    url: hostConfig.URL + "/signup", 
    form: content
  };
  
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  request.post(postData, 
                (err, httpResponse, body) => {
                  if ( err ) { console.log(err); }
                  data = JSON.parse(body)
                  console.log('message: ' + data.message);
                	console.log('code: ' + data.code);
                });
}


if ( process.argv.length == 3 ) {
  testdata.userid = process.argv[2];
}

test1_CreateUser();  
