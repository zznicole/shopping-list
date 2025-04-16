"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AdminScreen;
require("core-js/modules/es.number.to-fixed.js");
require("core-js/modules/es.parse-float.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _axios = _interopRequireDefault(require("axios"));
var _styles = require("@material-ui/core/styles");
var _core = require("@material-ui/core");
var _icons = require("@material-ui/icons");
var _Table = _interopRequireDefault(require("@material-ui/core/Table"));
var _TableBody = _interopRequireDefault(require("@material-ui/core/TableBody"));
var _TableCell = _interopRequireDefault(require("@material-ui/core/TableCell"));
var _TableContainer = _interopRequireDefault(require("@material-ui/core/TableContainer"));
var _TableHead = _interopRequireDefault(require("@material-ui/core/TableHead"));
var _TableRow = _interopRequireDefault(require("@material-ui/core/TableRow"));
var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const apiBaseUrl = "/";
const useStyles = (0, _styles.makeStyles)(theme => ({
  // table: {
  //   minWidth: 650,
  // },
  header: {
    fontSize: 24,
    backgroundColor: '#00bcd4',
    color: '#ffffff',
    width: '50%',
    minHeight: 43,
    paddingTop: 12,
    zIndex: 1,
    margin: 'auto'
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    backgroundColor: '#00bcd4'
  },
  homeButton: {
    marginLeft: theme.spacing(1),
    color: '#ffffff'
  },
  shareButton: {
    marginLeft: theme.spacing(1)
  }
}));
let fetchingList = false;
function AdminScreen() {
  const classes = useStyles();
  const [admdata, setAdmData] = (0, _react.useState)({
    groups: []
  });
  function fetchList(itemType) {
    let url = apiBaseUrl + "admindata?item=" + itemType;
    _axios.default.get(url).then(function (response) {
      try {
        fetchingList = true;
        if (response.data.result) {
          setAdmData(response.data.result);
        }
      } catch (e) {
        console.log(e);
      }
    }).catch(reason => {
      if (reason.response.status === 401) {
        // history.push('/');
      } else {
        alert(reason.response.data.message);
      }
    });
  }
  (0, _react.useEffect)(() => {
    if (!fetchingList) {
      fetchList('stats');
    } else {
      fetchingList = false;
    }
  });
  function Stats() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
      edge: "end",
      color: "inherit",
      className: classes.BarChart,
      onClick: () => {
        fetchList('stats');
      }
    }, /*#__PURE__*/_react.default.createElement(_icons.BarChart, null)));
  }
  function Sessions() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
      edge: "end",
      color: "inherit",
      className: classes.PeopleAlt,
      onClick: () => {
        fetchList('sessions');
      }
    }, /*#__PURE__*/_react.default.createElement(_icons.PeopleAlt, null)));
  }
  function Users() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
      edge: "end",
      color: "inherit",
      className: classes.People,
      onClick: () => {
        fetchList('allusers');
      }
    }, /*#__PURE__*/_react.default.createElement(_icons.People, null)));
  }
  function UnverifiedUsers() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
      edge: "end",
      color: "inherit",
      className: classes.PeopleOutline,
      onClick: () => {
        fetchList('unverifiedusers');
      }
    }, /*#__PURE__*/_react.default.createElement(_icons.PeopleOutline, null)));
  }
  function formatBytes(bytes) {
    let decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  function formatValue(cellValue) {
    let value = cellValue.value;
    let unit = cellValue.unit ? cellValue.unit : "";
    if (unit === 'count') {
      return value.toLocaleString('en');
    } else if (unit === 'bytes') {
      return formatBytes(value, 3);
    } else if (unit === 'datetime') {
      return value;
    } else if (unit === 'seconds') {
      let y = ~~(value / (3600 * 24 * 365));
      let d = ~~(value / (3600 * 24) % 365);
      let h = ~~(value / 3600 % 24);
      let m = ~~(value / 60 % 60);
      let s = value % 60; // keep fractions
      return (y > 0 ? "".concat(y, "y ") : "") + (y > 0 | d > 0 ? "".concat(d, "d ") : "") + (y > 0 | d > 0 | h > 0 ? "".concat(h, "h ") : "") + (y > 0 | d > 0 | h > 0 | m > 0 ? "".concat(m, "m ") : "") + "".concat(s, "s"); // always print seconds + fractions
    }
    return value;
  }
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_core.AppBar, {
    position: "fixed",
    style: {
      backgroundColor: "#00bcd4"
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Toolbar, {
    className: classes.topBar
  }, /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "h5",
    align: "center",
    className: classes.header
  }, "Admin"))), /*#__PURE__*/_react.default.createElement(_core.Toolbar, null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("div", {
    margin: "10",
    width: "80%"
  }, admdata.groups.map(group => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.Typography, {
    variant: "h6",
    align: "left"
  }, group.heading), /*#__PURE__*/_react.default.createElement(_TableContainer.default, {
    component: _Paper.default
  }, /*#__PURE__*/_react.default.createElement(_Table.default, {
    className: classes.table,
    size: "small",
    "aria-label": "a dense table"
  }, /*#__PURE__*/_react.default.createElement(_TableHead.default, null, /*#__PURE__*/_react.default.createElement(_TableRow.default, null)), /*#__PURE__*/_react.default.createElement(_TableBody.default, null, group.items.map(row => /*#__PURE__*/_react.default.createElement(_TableRow.default, null, row.map((cellValue, index) => {
    if (index === 0) {
      return /*#__PURE__*/_react.default.createElement(_TableCell.default, {
        component: "th",
        scope: "row",
        align: "left"
      }, formatValue(cellValue));
    } else {
      return /*#__PURE__*/_react.default.createElement(_TableCell.default, {
        component: "th",
        scope: "row",
        align: "right"
      }, formatValue(cellValue));
    }
  }))))))))), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.AppBar, {
    position: "fixed",
    className: classes.appBar
  }, /*#__PURE__*/_react.default.createElement(_core.Toolbar, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/lists"
  }, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
    edge: "start",
    color: "inherit",
    className: classes.homeButton
  }, /*#__PURE__*/_react.default.createElement(_icons.Home, null))), /*#__PURE__*/_react.default.createElement(Stats, null), /*#__PURE__*/_react.default.createElement(Sessions, null), /*#__PURE__*/_react.default.createElement(Users, null), /*#__PURE__*/_react.default.createElement(UnverifiedUsers, null))));
}