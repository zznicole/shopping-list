"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LoginScreen;
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _axios = _interopRequireDefault(require("axios"));
var _core = require("@material-ui/core");
var _styles = require("@material-ui/core/styles");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useStyles = (0, _styles.makeStyles)(theme => ({
  screen: {
    backgroundImage: "url('/OSL-bg.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    display: "flex",
    minHeight: "100vh"
  },
  formContainer: {
    maxWidth: "80%",
    maxHeight: "70%",
    backgroundColor: "#FCF9d4",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    display: "flex",
    boxShadow: "8px 16px 9px rgba(0, 0, 0, 0.25)"
  },
  heading: {
    fontFamily: "Gloria Hallelujah",
    fontStyle: "bold",
    fontWeight: "700",
    color: "#2D1E2F",
    fontSize: "22"
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "2rem",
    paddingBottom: "2rem",
    position: "relative"
  },
  pinIcon: {
    position: "absolute",
    top: "0",
    right: "50%"
  },
  loginBtn: {
    width: "100%"
  },
  signupBtn: {
    width: "100%"
  },
  forgotPasswoodBtn: {
    fontSize: "8"
  }
}));
function LoginScreen(props) {
  const classes = useStyles();
  const [username, setUsername] = (0, _react.useState)("");
  const [password, setPassword] = (0, _react.useState)("");
  const [keepLoggedIn, setKeepLoggedIn] = (0, _react.useState)(true);
  const history = (0, _reactRouterDom.useHistory)();
  const apiBaseUrl = "/";
  let loggedIn = document.cookie.replace(/(?:(?:^|.*;\s*)loggedIn\s*=\s*([^;]*).*$)|^.*$/, "$1");
  if (loggedIn) {
    history.push("/lists");
  }
  const onUsePasswordHandler = event => {
    let payload = {
      userid: username,
      password: password,
      keepLoggedIn: keepLoggedIn
    };
    _axios.default.post(apiBaseUrl + "login", payload).then(function (response) {
      console.log(response);
      if (response.status === 200) {
        console.log("Login successful");
        history.push("/lists");
      } else if (response.status === 401) {
        console.log("Error logging in");
        alert("Error logging in");
        history.push("/");
      }
    }).catch(function (error) {
      console.log(error);
    });
  };
  const onUseLinkHandler = event => {
    let payload = {
      userid: username,
      keepLoggedIn: keepLoggedIn
    };
    _axios.default.post(apiBaseUrl + "loginlink", payload).then(function (response) {
      console.log(response);
      if (response.status === 200) {
        alert("Link sent, check your email!");
        history.push("/");
      } else if (response.status === 401) {
        alert(response.message);
        history.push("/");
      }
    }).catch(function (error) {
      console.log(error);
    });
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.screen
  }, /*#__PURE__*/_react.default.createElement(_core.Container, {
    className: classes.formContainer
  }, /*#__PURE__*/_react.default.createElement("form", {
    className: classes.form
  }, /*#__PURE__*/_react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
    className: classes.pinIcon,
    icon: _freeSolidSvgIcons.faThumbtack,
    color: "red",
    transform: {
      rotate: 42
    }
  }), /*#__PURE__*/_react.default.createElement("h1", {
    className: classes.heading
  }, "Our Shopping List"), /*#__PURE__*/_react.default.createElement(_core.FormControl, null, /*#__PURE__*/_react.default.createElement(_core.TextField, {
    type: "Email",
    required: true,
    autoComplete: "off",
    variant: "standard",
    size: "medium",
    label: "Email",
    floatingLabelText: "Email",
    onChange: e => setUsername(e.target.value)
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: classes.loginBtn,
    variant: "outlined",
    color: "secondary",
    onClick: onUseLinkHandler
  }, "Send login link"), /*#__PURE__*/_react.default.createElement("br", null), "or use password...", /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.TextField, {
    type: "password",
    required: true,
    autoComplete: "off",
    variant: "standard",
    size: "medium",
    label: "Password",
    floatingLabelText: "Password",
    onChange: e => setPassword(e.target.value),
    backgroundColor: "#FCF6B1"
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: classes.loginBtn,
    variant: "contained",
    color: "secondary",
    onClick: onUsePasswordHandler
  }, "LOG IN"), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    className: classes.forgotPasswoodBtn,
    to: "/passwordresetrequest",
    color: "primary"
  }, "Forgot Your Password?"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.FormControlLabel, {
    control: /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
      checked: keepLoggedIn,
      onChange: (event, newValue) => setKeepLoggedIn({
        keepLoggedIn: !keepLoggedIn
      })
    }),
    label: "Keep me logged in."
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("p", null, "Not signed up yet? Sign up now!"), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/signup",
    style: {
      textDecoration: "none"
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: classes.signupBtn,
    variant: "outlined",
    color: "secondary"
  }, "SIGN UP"))))));
}