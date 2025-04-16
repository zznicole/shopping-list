"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ListScreen;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _Lists = _interopRequireDefault(require("./Lists"));
var _styles = require("@material-ui/core/styles");
var _core = require("@material-ui/core");
var _icons = require("@material-ui/icons");
var _axios = _interopRequireDefault(require("axios"));
var _reactRouterDom = require("react-router-dom");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const moment = require('moment');
const useStyles = (0, _styles.makeStyles)(theme => ({
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
  lists: {
    marginBottom: 60
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
let fetchingLists = false;
function ListScreen() {
  const classes = useStyles();
  const [lists, setLists] = (0, _react.useState)([]);
  const [isAdmin, setIsAdmin] = (0, _react.useState)(false);
  const apiBaseUrl = "/";
  const history = (0, _reactRouterDom.useHistory)();
  function fetchLists() {
    _axios.default.get(apiBaseUrl + "userlists").then(function (response) {
      try {
        console.log("ok");
        fetchingLists = true;
        setLists(response.data.result);
        setIsAdmin(response.data.isAdmin);
      } catch (e) {
        console.log(e);
      }
    }).catch(reason => {
      if (reason.response.status === 401) {
        history.push('/');
      } else {
        alert(reason.response.data.message);
      }
    });
  }
  (0, _react.useEffect)(() => {
    if (!fetchingLists) {
      fetchLists();
    } else {
      fetchingLists = false;
    }
  });

  // mark as completed
  const checkList = id => {
    console.log(id);
    setLists(lists.map(list => {
      if (list.id === id) {
        list.isCompleted = !list.isCompleted;
      }
      console.log(list.isCompleted);
      return list;
    }));
  };
  function rmList(id) {
    _axios.default.post(apiBaseUrl + "rmlist", {
      listid: id
    }).then(function (response) {
      fetchLists();
    }).catch(reason => {
      if (reason.response.status === 401) {
        history.push('/');
      } else {
        alert(reason.response.data.message);
      }
    });
  }
  const deleteList = id => {
    rmList(id);
  };
  function createList(title) {
    _axios.default.post(apiBaseUrl + "createlist", {
      summary: title,
      description: ""
    }).then(function (response) {
      history.push('/list/' + response.data.result.listid);
    }).catch(reason => {
      if (reason.response.status === 401) {
        history.push('/');
      } else {
        alert(reason.response.data.message);
      }
    });
  }

  // Add a list
  const addList = event => {
    createList("Shopping on " + moment().format('dddd D MMMM'));
  };
  const goToList = id => {
    history.push('/list/' + id);
  };

  // log out confirmation
  const goToLogin = () => {
    if (window.confirm('Do you want to log out?')) {
      _axios.default.get(apiBaseUrl + "logout");
      history.push('/');
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_core.AppBar, {
    position: "fixed"
  }, /*#__PURE__*/_react.default.createElement(_core.Toolbar, {
    className: classes.topBar
  }, /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "h5",
    align: "center",
    className: classes.header
  }, "My Shopping Lists"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    variant: "outlined",
    onClick: goToLogin
  }, "Logout"))), /*#__PURE__*/_react.default.createElement(_core.Toolbar, null), /*#__PURE__*/_react.default.createElement(_Lists.default, {
    lists: lists || [],
    checkL: checkList,
    deleteList: deleteList,
    goToList: goToList,
    className: classes.lists
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.AppBar, {
    color: "primary",
    className: classes.appBar
  }, /*#__PURE__*/_react.default.createElement(_core.Toolbar, null, /*#__PURE__*/_react.default.createElement(_core.Fab, {
    color: "secondary",
    className: classes.fabButton
  }, /*#__PURE__*/_react.default.createElement(_icons.Add, {
    onClick: event => addList(event)
  })), isAdmin === true ? /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/admin"
  }, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
    edge: "start",
    color: "inherit",
    className: classes.SupervisorAccount
  }, /*#__PURE__*/_react.default.createElement(_icons.SupervisorAccount, null))) : /*#__PURE__*/_react.default.createElement("br", null))));
}