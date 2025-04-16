"use strict";

require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _MuiThemeProvider = _interopRequireDefault(require("material-ui/styles/MuiThemeProvider"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _TextField = _interopRequireDefault(require("material-ui/TextField"));
var _react = _interopRequireWildcard(require("react"));
var _axios = _interopRequireDefault(require("axios"));
var _reactRouter = require("react-router");
var _CssBaseline = _interopRequireDefault(require("@material-ui/core/CssBaseline"));
var _styles = require("@material-ui/core/styles");
var _Checkbox = _interopRequireDefault(require("@material-ui/core/Checkbox"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const styles = theme => ({
  "@global": {
    body: {
      backgroundImage: "url('/OSL-bg.png')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
      height: "100%"
    },
    html: {
      height: "100%"
    },
    "#componentWithId": {
      height: "100%"
    }
  }
});
class Login extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      keepLoggedIn: false
    };
  }
  handleClick(event) {
    const apiBaseUrl = "/";
    let self = this;
    let payload = {
      userid: self.state.username,
      password: self.state.password,
      keepLoggedIn: self.state.keepLoggedIn
    };
    _axios.default.post(apiBaseUrl + "login", payload).then(function (response) {
      console.log(response);
      if (response.status === 200) {
        console.log("Login successful");
        self.props.history.push('/lists');
      } else if (response.status === 401) {
        console.log("Error logging in");
        alert("Error logging in");
        self.props.history.push('/');
      }
    }).catch(function (error) {
      console.log(error);
    });
  }
  render() {
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_MuiThemeProvider.default, null, /*#__PURE__*/_react.default.createElement(_CssBaseline.default, null), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '40%',
        transform: 'translate(-50%, -50%)'
      }
    }, /*#__PURE__*/_react.default.createElement(_TextField.default, {
      hintText: "Enter your Username",
      id: "standard-basic",
      label: "Standard",
      floatingLabelText: "Username",
      autoComplete: "off",
      autoFocus: true,
      onChange: (event, newValue) => this.setState({
        username: newValue
      })
    }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_TextField.default, {
      type: "password",
      hintText: "Enter your Password",
      id: "standard-basic",
      label: "Standard",
      floatingLabelText: "Password",
      autoComplete: "off",
      onChange: (event, newValue) => this.setState({
        password: newValue
      })
    }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      label: "LOG IN",
      primary: true,
      style: style,
      onClick: event => this.handleClick(event)
    }), /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
      checked: this.state.keepLoggedIn,
      onChange: (event, newValue) => this.setState({
        keepLoggedIn: !this.state.keepLoggedIn
      })
    })))));
  }
}
const style = {
  margin: 15
};
var _default = exports.default = (0, _styles.withStyles)(styles)((0, _reactRouter.withRouter)(Login));