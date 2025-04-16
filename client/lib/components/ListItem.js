"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ListItem;
var _react = _interopRequireDefault(require("react"));
var _core = require("@material-ui/core");
var _icons = require("@material-ui/icons");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ListItem(_ref) {
  let {
    title,
    subtitle,
    checkList,
    id,
    isCompleted,
    deleteList,
    goToList,
    sharing
  } = _ref;
  const markCompleted = () => checkList(id);
  const clickOnList = () => goToList(id);
  const listStyle = isCompleted ? {
    textDecoration: "line-through",
    minWidth: 0,
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  } : {
    textDecoration: "none",
    minWidth: 0,
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
  const delList = () => deleteList(id);
  const confirmDel = () => {
    if (window.confirm("Do you want to delete this list?")) {
      delList();
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_core.Container, null, /*#__PURE__*/_react.default.createElement(_core.Card, {
    variant: "contained",
    style: {
      marginTop: 5,
      display: "flex",
      alignContent: "space-between",
      alignItems: "stretch"
    }
  }, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
    onClick: markCompleted
  }, /*#__PURE__*/_react.default.createElement(_icons.Check, {
    style: {
      color: "green"
    }
  })), /*#__PURE__*/_react.default.createElement(_core.CardContent, {
    onClick: clickOnList,
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "h5",
    component: "h2",
    style: listStyle
  }, title), /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "subtitle1",
    style: listStyle,
    color: "textSecondary"
  }, subtitle), /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "subtitle2",
    style: listStyle,
    color: "textSecondary",
    align: "right"
  }, sharing)), /*#__PURE__*/_react.default.createElement(_core.IconButton, {
    style: {
      float: "right"
    },
    onClick: confirmDel
  }, /*#__PURE__*/_react.default.createElement(_icons.Delete, {
    style: {
      color: "red"
    }
  })))));
}