"use strict";

require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
require("./App.css");
var _LoginScreen = _interopRequireDefault(require("./components/LoginScreen"));
var _SignupScreen = _interopRequireDefault(require("./components/SignupScreen"));
var _VerifyScreen = _interopRequireDefault(require("./components/VerifyScreen"));
var _ListsScreen = _interopRequireDefault(require("./components/ListsScreen"));
var _TobuyListScreen = _interopRequireDefault(require("./components/TobuyListScreen"));
var _ShareScreen = _interopRequireDefault(require("./components/ShareScreen"));
var _PwResetRequestScreen = _interopRequireDefault(require("./components/PwResetRequestScreen"));
var _PwResetScreen = _interopRequireDefault(require("./components/PwResetScreen"));
var _AdminScreen = _interopRequireDefault(require("./components/AdminScreen"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// import injectTapEventPlugin from "react-tap-event-plugin";

class App extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginPage: [],
      uploadScreen: []
    };
  }
  componentWillMount() {
    let loginPage = [];
    loginPage.push(/*#__PURE__*/_react.default.createElement(_LoginScreen.default, {
      parentContext: this
    }));
    this.setState({
      loginPage: loginPage
    });
  }
  render() {
    return /*#__PURE__*/_react.default.createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: "/",
      exact: true,
      component: _LoginScreen.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: "/signup",
      exact: true,
      component: _SignupScreen.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: "/lists",
      component: _ListsScreen.default,
      isPrivate: true
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: "/list/:listid",
      component: _TobuyListScreen.default,
      isPrivate: true
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: "/share/:listid",
      component: _ShareScreen.default,
      isPrivate: true
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: "/verify/:status",
      component: _VerifyScreen.default,
      isPrivate: true
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: "/passwordresetrequest",
      component: _PwResetRequestScreen.default,
      isPrivate: true
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: "/passwordreset",
      component: _PwResetScreen.default,
      isPrivate: true
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: "/admin",
      component: _AdminScreen.default,
      isPrivate: true
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      component: _LoginScreen.default
    })));
  }
}
var _default = exports.default = App;