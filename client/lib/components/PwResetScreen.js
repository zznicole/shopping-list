"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PwResetScreen;
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
function PwResetScreen(props) {
  const classes = useStyles();
  const [password, setPassword] = (0, _react.useState)("");
  const history = (0, _reactRouterDom.useHistory)();
  const apiBaseUrl = "/";
  const onClickHandler = event => {
    let payload = {
      password: password,
      confirm_password: password
    };
    _axios.default.post(apiBaseUrl + "passwordreset", payload).then(function (response) {
      console.log(response);
      if (response.status === 200) {
        console.log("Reset password successful");
        history.push("/");
      } else if (response.status === 401) {
        console.log("Error resetting password");
        alert("Error resetting password");
        history.push("/passwordreset:request");
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
  }, "Reset Your Password"), /*#__PURE__*/_react.default.createElement(_core.FormControl, null, /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.TextField, {
    type: "password",
    required: true,
    autoComplete: "off",
    variant: "standard",
    size: "medium",
    label: "New Password",
    floatingLabelText: "New Password",
    onChange: e => setPassword(e.target.value),
    backgroundColor: "#FCF6B1"
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.TextField, {
    type: "password",
    required: true,
    autoComplete: "off",
    variant: "standard",
    size: "medium",
    label: "Confirm New Password",
    floatingLabelText: "Confirm New Password",
    onChange: e => setPassword(e.target.value),
    backgroundColor: "#FCF6B1"
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: classes.loginBtn,
    variant: "contained",
    color: "secondary",
    onClick: onClickHandler
  }, "Reset Password"), /*#__PURE__*/_react.default.createElement("br", null)))));
}