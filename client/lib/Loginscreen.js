"use strict";

require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _MuiThemeProvider = _interopRequireDefault(require("material-ui/styles/MuiThemeProvider"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _Login = _interopRequireDefault(require("./Login"));
var _Signup = _interopRequireDefault(require("./Signup"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class Loginscreen extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      Loginscreen: [],
      loginmessage: "",
      buttonLabel: "Sign up",
      isLogin: true
    };
  }
  componentWillMount() {
    let loginscreen = [];
    loginscreen.push(/*#__PURE__*/_react.default.createElement(_Login.default, {
      parentContext: this,
      appContext: this.props.parentContext
    }));
    let loginmessage = "Not signed up yet? Sign up now!";
    this.setState({
      loginscreen: loginscreen,
      loginmessage: loginmessage
    });
  }
  handleClick(event) {
    let loginmessage;
    if (this.state.isLogin) {
      let loginscreen = [];
      loginscreen.push(/*#__PURE__*/_react.default.createElement(_Signup.default, {
        parentContext: this
      }));
      loginmessage = "Already registered? Go to login!";
      this.setState({
        loginscreen: loginscreen,
        loginmessage: loginmessage,
        buttonLabel: "LOG IN",
        isLogin: false
      });
    } else {
      var loginscreen = [];
      loginscreen.push(/*#__PURE__*/_react.default.createElement(_Login.default, {
        parentContext: this
      }));
      loginmessage = "Not registered yet? Go to signup!";
      this.setState({
        loginscreen: loginscreen,
        loginmessage: loginmessage,
        buttonLabel: "SIGN UP",
        isLogin: true
      });
    }
  }
  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "loginscreen"
    }, this.state.loginscreen, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '80%',
        transform: 'translate(-50%, -50%)'
      }
    }, this.state.loginmessage, /*#__PURE__*/_react.default.createElement(_MuiThemeProvider.default, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      label: this.state.buttonLabel,
      primary: true,
      style: style,
      onClick: event => this.handleClick(event)
    })))));
  }
}
const style = {
  margin: 15
};
var _default = exports.default = Loginscreen;