"use strict";

var _react = _interopRequireDefault(require("react"));
var _react2 = require("@testing-library/react");
var _App = _interopRequireDefault(require("./App"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
test('renders learn react link', () => {
  const {
    getByText
  } = (0, _react2.render)(/*#__PURE__*/_react.default.createElement(_App.default, null));
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});