"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TobuyForm;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _core = require("@material-ui/core");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function TobuyForm(_ref) {
  let {
    addTobuy
  } = _ref;
  const [text, setText] = (0, _react.useState)('');
  const handleSubmit = e => {
    e.preventDefault();
    addTobuy(text);
    setText('');
  };
  return /*#__PURE__*/_react.default.createElement(_core.Container, null, /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/_react.default.createElement(_core.FormControl, {
    fullWidth: true,
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/_react.default.createElement(_core.TextField, {
    id: "outlined-basic",
    label: "Type item here",
    required: true,
    value: text,
    onChange: e => setText(e.target.value)
  }), /*#__PURE__*/_react.default.createElement(_core.Fab, {
    variant: "contained",
    color: "secondary",
    type: "submit",
    "aria-label": "add",
    style: {
      marginTop: 5,
      maxWidth: "30%"
    }
  }, "Add"))));
}