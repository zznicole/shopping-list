import React, { useEffect } from 'react';
import { useState } from 'react';
import TobuyList from './TobuyList';
import TobuyForm from './TobuyForm';
import { Link, useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import EdiText from 'react-editext';
import { Home, Share, Category, FormatListBulleted } from '@material-ui/icons'
import axios from "axios";
import Box from '@material-ui/core/Box';

const apiBaseUrl = "/";

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: 24,
    backgroundColor: '#00bcd4',
    color: '#ffffff',
    width: '50%',
    minHeight: 43,
    paddingTop: 12,
    zIndex: 1,
    margin: 'auto',
  },
  
  appBar: {
    top: 'auto',
    bottom: 0,
    backgroundColor: '#00bcd4',
  },

  homeButton: {
    marginLeft: theme.spacing(1),
    color: '#ffffff',
  },

  shareButton: {
    marginLeft: theme.spacing(1),
  }
}));

let fetchingList = false;

export default function TobuyListScreen() {
  const classes = useStyles();
  const [list, setList] = useState({summary: "",items:[], isOwn: false, isShared:false, shareCount:0, owner:"", aggregated:false});
  const { listid } = useParams();
  const history = useHistory();
  
  function fetchList() {
    let url = apiBaseUrl + "getlist?listid=" + listid;
    if (list.aggregated) {
      url = apiBaseUrl + "aggregatedlist?listid=" + listid;
    }
    axios
      .get(url)
      .then(function (response) {
        try {
          fetchingList = true;
          if (response.data.result) {
            setList(response.data.result);
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
  
  useEffect(() => {
    if (!fetchingList) {
      fetchList();
    } else {
      fetchingList = false;
    }
  });
  
// add a list title
  function editList(title) {
    axios
      .post(apiBaseUrl + "editlist", {listid: listid, summary: title, description: "", done: false})
      .then(function (response) {
        fetchList();
      }).catch(reason => {
        if (reason.response.status === 401) {
          history.push('/');
        } else {
          alert(reason.response.data.message);
        }
      });
  }

  function onSave(val) {
    editList(val);
  }

  function addTobuy(text) {
    axios
      .post(apiBaseUrl + "newitem", {listid: listid, summary: text, description: ""})
      .then(function (response) {
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
    axios
      .post(apiBaseUrl + "rmitem", {listid: listid, itemid: id})
      .then(function (response) {
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
        axios
          .post(apiBaseUrl + "edititem", {itemid: id, isCompleted: !tobuy.isCompleted, summary:tobuy.title})
          .then(function (response) {
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
        axios
          .post(apiBaseUrl + "edititem", {itemid: id, isCompleted: tobuy.isCompleted, summary:newTitle})
          .then(function (response) {
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
    history.push('/share/'+listid);
  }
  const switchToAggregated = () => {
    list.aggregated = true;
    fetchList();
  }
  const switchToList = () => {
    list.aggregated = false;
    fetchList();
  }
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
      return <><IconButton edge="end"  color="inherit" className={classes.shareButton}>
            <FormatListBulleted onClick={switchToList} />
      </IconButton></>;
    } else {
      return <><IconButton edge="end"  color="inherit" className={classes.shareButton}>
            <Category onClick={switchToAggregated} />
      </IconButton></>;
    }
  }
  function Sharing() {
    if (list.isOwn) {
      if (list.isShared) {
        return <><IconButton edge="end"  color="inherit" className={classes.shareButton}>
          <Share onClick={goToShare} />
        </IconButton>
          <Box ml={1.5}>
            <Typography variant={'subtitle'}>
              Sharing with:
            </Typography>
            <Typography variant={'subtitle2'}>
              {usersAsString(list.sharedWith)}.
            </Typography>
          </Box></>;
      } else {
        return <IconButton edge="end"  color="inherit" className={classes.shareButton}>
          <Share onClick={goToShare} />
        </IconButton>;
      }
    }
    return <><div>
      <Typography variant={'subtitle'}>
        Shared by:
      </Typography>
      <Typography variant={'subtitle2'}>
        {screenName(list.owner)}
      </Typography>
    </div></>;
  
  }
  
  return (
    <div>
      <AppBar position="fixed" style={{backgroundColor:"#00bcd4"}}>
        <EdiText variant="h5" type="text" value={list.summary} className={classes.header} onSave={onSave} />
      </AppBar>
      <Toolbar />
      <TobuyForm addTobuy={addTobuy}  />
      <TobuyList
        tobuys={list.items}
        checkTobuy={checkTobuy}
        deleteTobuy={deleteTobuy}
        editTobuy={editTobuy}
        keyPrefix={list.aggregated?"a":"s"}
      />
      <br />
      <br />
      <br />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Link to='/lists'>
            <IconButton edge="start" color="inherit" className={classes.homeButton}>
              <Home />
            </IconButton>
          </Link>
          <Aggregator />
          <Sharing />
        </Toolbar>
      </AppBar>
    </div>
  );
}

