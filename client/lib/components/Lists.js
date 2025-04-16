"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Lists;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireDefault(require("react"));
var _ListItem = _interopRequireDefault(require("./ListItem"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function screenName(user) {
  return user.screenName && user.screenName.length > 0 ? user.screenName : user.userId;
}
function usersAsString(users) {
  let usersStr = "";
  if (users) {
    for (let u of users) {
      if (usersStr.length > 0) {
        usersStr = usersStr + ", ";
      }
      usersStr = usersStr + screenName(u);
    }
  }
  return usersStr;
}
function Lists(_ref) {
  let {
    lists,
    checkList,
    deleteList,
    goToList
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", null, lists.map(list => /*#__PURE__*/_react.default.createElement(_ListItem.default, {
    key: list.id,
    title: list.title,
    subtitle: list.subtitle,
    checkList: checkList,
    id: list.id,
    isCompleted: list.isCompleted,
    deleteList: deleteList,
    goToList: goToList,
    sharing: list.isOwn && list.isShared ? "Shared with " + usersAsString(list.sharedWith) + "." : !list.isOwn ? "Shared by " + screenName(list.owner) + "." : ""
  })));
}