"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TobuyList;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
var _react = _interopRequireDefault(require("react"));
var _TobuyItem = _interopRequireDefault(require("./TobuyItem"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function TobuyList(_ref) {
  let {
    tobuys,
    checkTobuy,
    deleteTobuy,
    editTobuy,
    keyPrefix
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", null, tobuys.map(tobuy => /*#__PURE__*/_react.default.createElement(_TobuyItem.default, {
    key: keyPrefix + tobuy.itemid,
    title: tobuy.title,
    subtitle: tobuy.subtitle,
    itemType: tobuy.itemType,
    checkTobuy: checkTobuy,
    id: tobuy.itemid,
    isCompleted: tobuy.isCompleted,
    checked: tobuy.checked ? tobuy.checked : tobuy.isCompleted,
    deleteTobuy: deleteTobuy,
    editTobuy: editTobuy
  })));
}