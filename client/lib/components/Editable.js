"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
const _excluded = ["text", "type", "placeholder", "callback", "children"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
const Editable = _ref => {
  let {
      text,
      type,
      placeholder,
      callback,
      children
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  const [isEditing, setEditing] = (0, _react.useState)(false);
  const handleKeyDown = (event, type) => {};
  return /*#__PURE__*/_react.default.createElement("section", props, isEditing ? /*#__PURE__*/_react.default.createElement("div", {
    onBlur: () => {
      setEditing(false);
      callback(false);
    },
    onKeyDown: e => handleKeyDown(e, type)
  }, children) : /*#__PURE__*/_react.default.createElement("div", {
    onClick: () => {
      setEditing(true);
      callback(true);
    }
  }, /*#__PURE__*/_react.default.createElement("span", null, text || placeholder || "Editable content")));
};
var _default = exports.default = Editable;