"use strict";

require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _MuiThemeProvider = _interopRequireDefault(require("material-ui/styles/MuiThemeProvider"));
var _AppBar = _interopRequireDefault(require("material-ui/AppBar"));
var _RaisedButton = _interopRequireDefault(require("material-ui/RaisedButton"));
var _TextField = _interopRequireDefault(require("material-ui/TextField"));
var _axios = _interopRequireDefault(require("axios"));
var _Login = _interopRequireDefault(require("./Login"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class Signup extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    };
  }
  handleClick(event) {
    const apiBaseUrl = "/";
    const history = (0, _reactRouterDom.useHistory)();
    console.log("values", this.state.first_name, this.state.last_name, this.state.email, this.state.password);
    let self = this;
    let payload = {
      userid: this.state.email,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password
    };
    _axios.default.post(apiBaseUrl + "signup", payload).then(function (response) {
      console.log(response);
      if (response.data.code === 200) {
        history.push('/verify/info');
        // var loginscreen = [];
        // loginscreen.push(<Login parentContext={this} />);
        // let loginmessage = "Not Signed up yet. Go to Sign up";
        // self.props.parentContext.setState({
        //   loginscreen: loginscreen,
        //   loginmessage: loginmessage,
        //   buttonLabel: "Sign Up",
        //   isLogin: true,
        // });
      }
    }).catch(function (error) {
      console.log(error);
    });
  }
  render() {
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_MuiThemeProvider.default, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_AppBar.default, {
      title: "SIGN UP"
    }), /*#__PURE__*/_react.default.createElement(_TextField.default, {
      hintText: "Enter your First Name",
      floatingLabelText: "First Name",
      onChange: (event, newValue) => this.setState({
        first_name: newValue
      })
    }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_TextField.default, {
      hintText: "Enter your Last Name",
      floatingLabelText: "Last Name",
      onChange: (event, newValue) => this.setState({
        last_name: newValue
      })
    }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_TextField.default, {
      hintText: "Enter your Email",
      type: "email",
      floatingLabelText: "Email",
      onChange: (event, newValue) => this.setState({
        email: newValue
      })
    }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_TextField.default, {
      hintText: "Enter your Password",
      type: "password",
      floatingLabelText: "Password",
      onChange: (event, newValue) => this.setState({
        password: newValue
      })
    }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_RaisedButton.default, {
      label: "Submit",
      primary: true,
      style: style,
      onClick: event => this.handleClick(event)
    }))));
  }
}
const style = {
  margin: 15
};
var _default = exports.default = Signup;