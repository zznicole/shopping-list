"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TobuyForm;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _core = require("@material-ui/core");
var _icons = require("@material-ui/icons");
var _styles = require("@material-ui/core/styles");
var _axios = _interopRequireDefault(require("axios"));
var _TobuyList = _interopRequireDefault(require("./TobuyList"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const apiBaseUrl = "/";
const useStyles = (0, _styles.makeStyles)(theme => ({
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
  backButton: {
    marginLeft: theme.spacing(1),
    color: '#ffffff'
  }
}));
let doNotFetch = false;
function TobuyForm(_ref) {
  let {
    addTobuy
  } = _ref;
  const classes = useStyles();
  const [text, setText] = (0, _react.useState)('');
  const [shares, setShares] = (0, _react.useState)([]);
  const {
    listid
  } = (0, _reactRouterDom.useParams)();
  const history = (0, _reactRouterDom.useHistory)();
  const backToList = () => {
    history.goBack();
  };
  const handleSubmit = e => {
    e.preventDefault();
    shareWithUser(text);
  };
  function fetchList() {
    _axios.default.get(apiBaseUrl + "getshares?listid=" + listid).then(function (response) {
      try {
        doNotFetch = true;
        setShares(response.data.result.friends);
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
    if (!doNotFetch) {
      fetchList();
    } else {
      doNotFetch = false;
    }
  });
  function shareWithUser(email) {
    _axios.default.post(apiBaseUrl + "sharelist", {
      listid: listid,
      userid: email
    }).then(function (response) {
      fetchList();
    }).catch(reason => {
      if (reason.response.status === 401) {
        history.push('/');
      } else {
        alert(reason.response.data.message);
      }
    });
  }
  function shareWithUserById(id) {
    _axios.default.post(apiBaseUrl + "sharelistbyid", {
      listid: listid,
      userid: id
    }).then(function (response) {
      fetchList();
    }).catch(reason => {
      if (reason.response.status === 401) {
        history.push('/');
      } else {
        alert(reason.response.data.message);
      }
    });
  }
  function removeShare(id) {
    _axios.default.post(apiBaseUrl + "rmshare", {
      listid: listid,
      userid: id
    }).then(function (response) {
      fetchList();
    }).catch(reason => {
      if (reason.response.status === 401) {
        history.push('/');
      } else {
        alert(reason.response.data.message);
      }
    });
  }
  return /*#__PURE__*/_react.default.createElement(_core.Container, null, /*#__PURE__*/_react.default.createElement(_core.AppBar, {
    position: "fixed"
  }, /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "h5",
    align: "center",
    className: classes.header
  }, "Grocery List")), /*#__PURE__*/_react.default.createElement(_core.Toolbar, null), /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/_react.default.createElement(_core.FormControl, {
    fullWidth: true,
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/_react.default.createElement(_core.TextField, {
    id: "outlined-basic",
    label: "Type username here",
    required: true,
    value: text,
    onChange: e => {
      doNotFetch = true;
      setText(e.target.value);
    }
  }), /*#__PURE__*/_react.default.createElement(_core.Fab, {
    variant: "contained",
    color: "secondary",
    type: "submit",
    "aria-label": "share",
    style: {
      marginTop: 5,
      maxWidth: "30%"
    }
  }, "Share"))), /*#__PURE__*/_react.default.createElement(_TobuyList.default, {
    tobuys: shares,
    checkTobuy: shareWithUserById
  }), /*#__PURE__*/_react.default.createElement(_core.AppBar, {
    position: "fixed",
    className: classes.appBar
  }, /*#__PURE__*/_react.default.createElement(_core.Toolbar, null, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
    edge: "start",
    color: "inherit",
    className: classes.backButton,
    onClick: backToList
  }, /*#__PURE__*/_react.default.createElement(_icons.ArrowBack, null)))));
}