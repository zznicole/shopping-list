const dboo = require('dboo');

class UserId {
  userId = "";
  screenName = "";
  constructor(userid = "", screenName = "") {
    this.userId = userid;
    this.screenName = screenName;
  }
};

exports.UserId = UserId;

dboo.class(UserId,
  [{"userId": dboo.string},
    {"screenName": dboo.string},
  ]
);

