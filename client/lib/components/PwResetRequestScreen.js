"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PwResetRequestScreen;
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
    paddingTop: "3rem",
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
  }
}));
function PwResetRequestScreen(props) {
  const classes = useStyles();
  const [email, setEmail] = (0, _react.useState)("");
  const history = (0, _reactRouterDom.useHistory)();
  const apiBaseUrl = "/";
  const onClickHandler = event => {
    let payload = {
      userid: email,
      email: email
    };
    _axios.default.post(apiBaseUrl + "passwordresetrequest", payload).then(function (response) {
      console.log(response);
      if (response.status === 200) {
        console.log("Send password reset request successful");
        history.push("/passwordreset");
      } else if (response.status === 401) {
        console.log("Error sending");
        alert("Error sending request");
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
  }, "Forgot Your password?"), /*#__PURE__*/_react.default.createElement("h3", null, "Don't worry, just fill in your Email, click Request Password Reset, we'll send you a link to reset your password."), /*#__PURE__*/_react.default.createElement(_core.FormControl, null, /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.TextField, {
    type: "Email",
    required: true,
    autoComplete: "off",
    variant: "standard",
    size: "medium",
    label: "Email",
    floatingLabelText: "Email",
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: classes.loginBtn,
    variant: "contained",
    color: "secondary",
    onClick: onClickHandler
  }, "Request Password Reset"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("p", null, "Not signed up yet? Sign up now!"), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/signup",
    style: {
      textDecoration: "none"
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: classes.signupBtn,
    variant: "contained",
    color: "secondary"
  }, "SIGN UP"))))));
}