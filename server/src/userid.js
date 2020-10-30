const dboo = require('dboo');

class UserId {
  userId = "";
  constructor(userid = "") {
    this.userId = userid;
  }
};

exports.UserId = UserId;

dboo.class(UserId,
  [{"userId": dboo.string}]
);

