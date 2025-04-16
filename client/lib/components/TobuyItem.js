"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TobuyItem;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _Editable = _interopRequireDefault(require("./Editable"));
var _core = require("@material-ui/core");
var _icons = require("@material-ui/icons");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function TobuyItem(_ref) {
  let {
    title,
    subtitle,
    itemType,
    checkTobuy,
    id,
    isCompleted,
    checked,
    deleteTobuy,
    editTobuy
  } = _ref;
  const [newTitle, setNewTitle] = (0, _react.useState)(title);
  const markCompleted = () => checkTobuy(id);
  const tobuyItemStyle = isCompleted ? {
    textDecoration: 'line-through',
    minWidth: 0,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  } : {
    textDecoration: 'none',
    minWidth: 0,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };
  const tobuyCheckboxColor = checked ? 'green' : 'lightgrey';
  const delTobuy = () => deleteTobuy(id);
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_core.Container, null, /*#__PURE__*/_react.default.createElement(_core.Card, {
    variant: "contained",
    style: {
      marginTop: 5,
      display: 'flex',
      alignContent: 'space-between',
      alignItems: 'stretch'
    }
  }, itemType === "header" ? /*#__PURE__*/_react.default.createElement(_core.CardContent, {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "h4",
    text: newTitle,
    type: "input",
    style: tobuyItemStyle
  }, title)) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
    onClick: markCompleted
  }, /*#__PURE__*/_react.default.createElement(_icons.Check, {
    style: {
      color: tobuyCheckboxColor
    }
  })), /*#__PURE__*/_react.default.createElement(_core.CardContent, {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, editTobuy === undefined ? /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "body1",
    text: newTitle,
    type: "input",
    style: tobuyItemStyle
  }, newTitle) : /*#__PURE__*/_react.default.createElement(_Editable.default, {
    variant: "h5",
    text: newTitle,
    placeholder: newTitle,
    type: "input",
    style: tobuyItemStyle
  }, /*#__PURE__*/_react.default.createElement(_core.Input, {
    variant: "h5",
    type: "text",
    name: "newTitle",
    placeholder: newTitle,
    value: newTitle,
    style: tobuyItemStyle,
    fullWidth: true,
    onChange: e => {
      setNewTitle(e.target.value);
      editTobuy(id, e.target.value);
    }
  }))), deleteTobuy === undefined ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null) : /*#__PURE__*/_react.default.createElement(_core.IconButton, {
    style: {
      float: 'right'
    },
    onClick: delTobuy
  }, /*#__PURE__*/_react.default.createElement(_icons.Delete, {
    style: {
      color: 'red'
    }
  }))))));
}