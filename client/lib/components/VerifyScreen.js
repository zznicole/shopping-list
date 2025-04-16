"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = VerifyScreen;
var _react = _interopRequireDefault(require("react"));
var _MuiThemeProvider = _interopRequireDefault(require("material-ui/styles/MuiThemeProvider"));
var _RaisedButton = _interopRequireDefault(require("material-ui/RaisedButton"));
var _core = require("@material-ui/core");
var _reactRouterDom = require("react-router-dom");
var _styles = require("@material-ui/core/styles");
var _CssBaseline = _interopRequireDefault(require("@material-ui/core/CssBaseline"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useStyles = (0, _styles.makeStyles)(theme => ({
  body: {
    backgroundImage: "url('/grocery.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    height: "100%"
  },
  topBar: {
    fontSize: 16,
    backgroundColor: '#00bcd4'
  },
  header: {
    fontSize: 24,
    backgroundColor: '#00bcd4',
    color: '#ffffff',
    width: '100%',
    minHeight: 43,
    paddingTop: 12,
    zIndex: 1
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    backgroundColor: '#00bcd4'
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto'
  }
}));
function VerifyScreen() {
  const classes = useStyles();
  const history = (0, _reactRouterDom.useHistory)();
  const {
    status
  } = (0, _reactRouterDom.useParams)();
  const goToLogin = () => {
    history.push('/');
  };
  let title = "";
  let message = "";
  if (status === 'postreg') {
    title = "Verify your account!";
    message = "We have sent an email to the email address you provided. To complete registration, click the link you can find in that email.";
  } else if (status === 'success') {
    title = "Congratulations!";
    message = "Your account registration is complete and you can now start to use ourshoppinglist!";
  } else if (status === 'failure') {
    title = "Error verifying account!";
    message = "Something went wrong, we were not able to verify your account.";
  } else if (status === 'loginlinkfailed') {
    title = "Error logging in!";
    message = "The link is either expired or in other ways invalid. Try requesting a new login link.";
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "loginscreen"
  }, /*#__PURE__*/_react.default.createElement(_MuiThemeProvider.default, null, /*#__PURE__*/_react.default.createElement(_CssBaseline.default, null), /*#__PURE__*/_react.default.createElement(_core.Toolbar, {
    className: classes.topBar
  }, /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "h5",
    align: "center",
    className: classes.header
  }, "Our Shopping List Online")), /*#__PURE__*/_react.default.createElement("div", {
    align: 'center'
  }, /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "h5"
  }, title), /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "body"
  }, message)), /*#__PURE__*/_react.default.createElement("div", {
    align: 'center'
  }, /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_RaisedButton.default, {
    label: "Go to LOGIN",
    primary: true,
    style: style,
    onClick: event => goToLogin()
  }))));
}
const style = {
  margin: 15
};