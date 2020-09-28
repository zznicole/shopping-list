const config = require('config');
emailConfig = config.get('emailConfig');

// trust all certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var Imap = require('imap'),
    inspect = require('util').inspect;
var fs = require('fs');
const simpleParser = require('mailparser').simpleParser;


var imap = new Imap(emailConfig.imap);

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    console.log(box.messages.total + ' message(s) found!');
    // 1:* - Retrieve all messages
    // 3:5 - Retrieve messages #3,4,5
    var f = imap.seq.fetch('1:*', {
      bodies: ''
    });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';

      msg.on('body', function(stream, info) {
        // use a specialized mail parsing library (https://github.com/andris9/mailparser)        
        simpleParser(stream, (err, mail) => {
          console.log(prefix + mail.subject);
          console.log(prefix + mail.text);
        });
        
        // or, write to file
        //stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
    
    // search example
//    imap.search([ 'UNSEEN', ['SINCE', 'May 20, 2010'] ], function(err, results) {
//      if (err) throw err;
//      var f = imap.fetch(results, { bodies: '' });
//      ...
//    }

  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

imap.connect();