"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TobuyListScreen;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _TobuyList = _interopRequireDefault(require("./TobuyList"));
var _TobuyForm = _interopRequireDefault(require("./TobuyForm"));
var _axios = _interopRequireDefault(require("axios"));
var _styles = require("@material-ui/core/styles");
var _core = require("@material-ui/core");
var _icons = require("@material-ui/icons");
var _Box = _interopRequireDefault(require("@material-ui/core/Box"));
var _Editable = _interopRequireDefault(require("./Editable"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const apiBaseUrl = "/";
const useStyles = (0, _styles.makeStyles)(theme => ({
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
  listTitleInputContainer: {
    padding: 16
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
let editingTitle = false;
function TobuyListScreen() {
  const classes = useStyles();
  const [list, setList] = (0, _react.useState)({
    summary: "",
    items: [],
    isOwn: false,
    isShared: false,
    shareCount: 0,
    owner: "",
    aggregated: false
  });
  const [newTitle, setNewTitle] = (0, _react.useState)("");
  const {
    listid
  } = (0, _reactRouterDom.useParams)();
  const history = (0, _reactRouterDom.useHistory)();
  function fetchList() {
    let url = apiBaseUrl + "getlist?listid=" + listid;
    if (list.aggregated) {
      url = apiBaseUrl + "aggregatedlist?listid=" + listid;
    }
    if (list.uncheckedFirst) {
      url = url + "&uncheckedfirst=true";
    }
    _axios.default.get(url).then(function (response) {
      try {
        fetchingList = true;
        if (response.data.result) {
          setList(response.data.result);
          setNewTitle(response.data.result.summary);
        }
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
    if (editingTitle) {
      return;
    }
    if (!fetchingList) {
      fetchList();
    } else {
      fetchingList = false;
    }
  });

  // add a list title
  function editList(title) {
    _axios.default.post(apiBaseUrl + "editlist", {
      listid: listid,
      summary: title,
      description: "",
      done: false
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
  const listTitleSubmitHandler = e => {
    e.preventDefault();
    //    editList(list.summary);
  };
  function onSave(val) {
    editList(val);
  }
  function addTobuy(text) {
    _axios.default.post(apiBaseUrl + "newitem", {
      listid: listid,
      summary: text,
      description: ""
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
  function deleteTobuy(id) {
    _axios.default.post(apiBaseUrl + "rmitem", {
      listid: listid,
      itemid: id
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
  function checkTobuy(id) {
    for (let i = 0; i < list.items.length; ++i) {
      let tobuy = list.items[i];
      if (tobuy.itemid === id) {
        _axios.default.post(apiBaseUrl + "edititem", {
          listid: listid,
          itemid: id,
          isCompleted: !tobuy.isCompleted,
          summary: tobuy.title
        }).then(function (response) {
          fetchList();
        }).catch(reason => {
          if (reason.response.status === 401) {
            history.push('/');
          } else {
            alert(reason.response.data.message);
          }
        });
        break;
      }
    }
  }
  function editTobuy(id, newTitle) {
    for (let i = 0; i < list.items.length; ++i) {
      let tobuy = list.items[i];
      if (tobuy.itemid === id) {
        _axios.default.post(apiBaseUrl + "edititem", {
          listid: listid,
          itemid: id,
          isCompleted: tobuy.isCompleted,
          summary: newTitle
        }).then(function (response) {
          fetchList();
        }).catch(reason => {
          if (reason.response.status === 401) {
            history.push('/');
          } else {
            alert(reason.response.data.message);
          }
        });
        break;
      }
    }
  }
  const goToShare = () => {
    history.push('/share/' + listid);
  };
  const switchToAggregated = () => {
    list.aggregated = true;
    fetchList();
  };
  const switchToList = () => {
    list.aggregated = false;
    fetchList();
  };
  const switchToUncheckedFirst = () => {
    list.uncheckedFirst = true;
    fetchList();
  };
  const switchToOriginalOrder = () => {
    list.uncheckedFirst = false;
    fetchList();
  };
  function screenName(user) {
    if (user.screenName && user.screenName.length > 0) {
      return user.screenName + " (" + user.userId + ")";
    }
    return user.userId;
  }
  function usersAsString(users) {
    let usersStr = "";
    if (users) {
      for (let u of users) {
        if (usersStr.length > 0) {
          usersStr = usersStr + ", ";
        }
        usersStr = usersStr + screenName(u);
      }
    }
    return usersStr;
  }
  function Aggregator() {
    if (list.aggregated) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
        edge: "end",
        color: "inherit",
        className: classes.shareButton
      }, /*#__PURE__*/_react.default.createElement(_icons.FormatListBulleted, {
        onClick: switchToList
      })));
    } else {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
        edge: "end",
        color: "inherit",
        className: classes.shareButton
      }, /*#__PURE__*/_react.default.createElement(_icons.Category, {
        onClick: switchToAggregated
      })));
    }
  }
  function UncheckedFirst() {
    if (list.uncheckedFirst) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
        edge: "end",
        color: "inherit",
        className: classes.shareButton
      }, /*#__PURE__*/_react.default.createElement(_icons.Reorder, {
        onClick: switchToOriginalOrder
      })));
    } else {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
        edge: "end",
        color: "inherit",
        className: classes.shareButton
      }, /*#__PURE__*/_react.default.createElement(_icons.Sort, {
        onClick: switchToUncheckedFirst
      })));
    }
  }
  function Sharing() {
    if (list.isOwn) {
      if (list.isShared) {
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
          edge: "end",
          color: "inherit",
          className: classes.shareButton
        }, /*#__PURE__*/_react.default.createElement(_icons.Share, {
          onClick: goToShare
        })), /*#__PURE__*/_react.default.createElement(_Box.default, {
          ml: 1.5
        }, /*#__PURE__*/_react.default.createElement(_core.Typography, {
          variant: 'subtitle2'
        }, "Shared with:"), /*#__PURE__*/_react.default.createElement(_core.Typography, {
          variant: 'subtitle2',
          component: 'small'
        }, usersAsString(list.sharedWith), ".")));
      } else {
        return /*#__PURE__*/_react.default.createElement(_core.IconButton, {
          edge: "end",
          color: "inherit",
          className: classes.shareButton
        }, /*#__PURE__*/_react.default.createElement(_icons.Share, {
          onClick: goToShare
        }));
      }
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_core.Typography, {
      variant: 'subtitle'
    }, "Shared by:"), /*#__PURE__*/_react.default.createElement(_core.Typography, {
      variant: 'subtitle2'
    }, screenName(list.owner))));
  }
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_core.AppBar, {
    position: "fixed",
    style: {
      backgroundColor: "#00bcd4"
    }
  }, /*#__PURE__*/_react.default.createElement(_Editable.default, {
    className: classes.header,
    text: newTitle,
    type: "input",
    callback: value => {
      editingTitle = value;
    },
    style: {
      flex: 1,
      width: '100%',
      minWidth: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center',
      margin: 6
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Input, {
    variant: "h1",
    type: "text",
    name: "title",
    value: newTitle,
    fullWidth: true,
    style: {
      flex: 1,
      width: '50%',
      minWidth: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center',
      margin: 6
    },
    onChange: e => {
      setNewTitle(e.target.value);
    },
    onBlur: e => editList(e.target.value)
  }))), /*#__PURE__*/_react.default.createElement(_core.Toolbar, null), /*#__PURE__*/_react.default.createElement(_TobuyForm.default, {
    addTobuy: addTobuy
  }), /*#__PURE__*/_react.default.createElement(_TobuyList.default, {
    tobuys: list.items,
    checkTobuy: checkTobuy,
    deleteTobuy: deleteTobuy,
    editTobuy: editTobuy,
    keyPrefix: list.aggregated ? "a" : "s"
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_core.AppBar, {
    position: "fixed",
    className: classes.appBar
  }, /*#__PURE__*/_react.default.createElement(_core.Toolbar, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/lists"
  }, /*#__PURE__*/_react.default.createElement(_core.IconButton, {
    edge: "start",
    color: "inherit",
    className: classes.homeButton
  }, /*#__PURE__*/_react.default.createElement(_icons.Home, null))), /*#__PURE__*/_react.default.createElement(Aggregator, null), /*#__PURE__*/_react.default.createElement(UncheckedFirst, null), /*#__PURE__*/_react.default.createElement(Sharing, null))));
}