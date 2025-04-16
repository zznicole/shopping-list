"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SignupScreen;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _axios = _interopRequireDefault(require("axios"));
var _core = require("@material-ui/core");
var _styles = require("@material-ui/core/styles");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _reactGoogleRecaptcha = _interopRequireDefault(require("react-google-recaptcha"));
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
function SignupScreen(props) {
  const classes = useStyles();
  const [firstName, setFirstname] = (0, _react.useState)("");
  const [lastName, setLastname] = (0, _react.useState)("");
  const [email, setEmail] = (0, _react.useState)("");
  const [password, setPassword] = (0, _react.useState)("");
  const [message, setMessage] = (0, _react.useState)("");
  const [recaptchaResponse, setReCAPTCHA] = (0, _react.useState)(false);
  const apiBaseUrl = "/";
  const history = (0, _reactRouterDom.useHistory)();
  const onClickHandler = event => {
    let payload = {
      userid: email,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      recaptcha: recaptchaResponse
    };
    _axios.default.post(apiBaseUrl + "signup", payload).then(function (response) {
      console.log(response);
      if (response.data.code === 200) {
        history.push("/verify/postreg");
      } else {
        setMessage(response.data.message);
      }
    }).catch(function (error) {
      console.log(error);
    });
  };
  function Message() {
    if (message.length === 0) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null));
    } else {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.Typography, {
        color: "colorError"
      }, message));
    }
  }
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
    type: "text",
    required: true,
    autoComplete: "off",
    variant: "standard",
    size: "medium",
    label: "First Name",
    floatingLabelText: "First Name",
    onChange: e => setFirstname(e.target.value)
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.TextField, {
    type: "text",
    required: true,
    autoComplete: "off",
    variant: "standard",
    size: "medium",
    label: "Last Name",
    floatingLabelText: "Last Name",
    onChange: e => setLastname(e.target.value)
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.TextField, {
    type: "email",
    required: true,
    autoComplete: "off",
    variant: "standard",
    size: "medium",
    label: "Email",
    floatingLabelText: "Email",
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.TextField, {
    type: "password",
    required: true,
    autoComplete: "off",
    variant: "standard",
    size: "medium",
    label: "Password",
    floatingLabelText: "Password",
    onChange: e => setPassword(e.target.value),
    backgroundColor: "#FCF6B1"
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_reactGoogleRecaptcha.default, {
    sitekey: "6Lfu32cfAAAAACdXFdkxedBNOygTdsC1fSA7SIIo",
    onChange: recaptchaValue => setReCAPTCHA(recaptchaValue)
  }), ",", /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: classes.loginBtn,
    variant: "contained",
    color: "secondary",
    onClick: onClickHandler,
    disabled: recaptchaResponse === false
  }, "Sign Up"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(Message, null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("p", null, "Already signed up?"), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: classes.signupBtn,
    variant: "outlined",
    color: "secondary"
  }, "Log In"))))));
}