import React, {useEffect} from 'react';
import { useState } from 'react';
import TobuyList from './TobuyList';
import TobuyForm from './TobuyForm';
import { Link, useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Typography, AppBar, Toolbar, IconButton} from '@material-ui/core';
import { Home, Share } from '@material-ui/icons'
import axios from "axios";

const apiBaseUrl = "/";

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: 24,
    backgroundColor: '#00bcd4',
    color: '#ffffff',
    width: '100%',
    minHeight: 43,
    paddingTop: 12,
    zIndex: 1,
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
  const [tobuys, setTobuys] = useState([]);
  const { listid } = useParams();
  const history = useHistory();
  
  function fetchList() {
    axios
      .get(apiBaseUrl + "getlist?listid=" + listid)
      .then(function (response) {
        try {
          fetchingList = true;
          setTobuys(response.data.result.items);
        } catch (e) {
          console.log(e);
        }
      }).catch(reason => {
        if (reason.response.status == 401) {
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
  
  function addTobuy(text) {
    axios
      .post(apiBaseUrl + "newitem", {listid: listid, summary: text, description: ""})
      .then(function (response) {
        fetchList();
      }).catch(reason => {
        if (reason.response.status == 401) {
          history.push('/');
        } else {
          alert(reason.response.data.message);
        }
      });
  }
  
  function deleteTobuy(id) {
    console.log(id);
    axios
      .post(apiBaseUrl + "rmitem", {listid: listid, itemid: id})
      .then(function (response) {
        fetchList();
      }).catch(reason => {
        if (reason.response.status == 401) {
          history.push('/');
        } else {
          alert(reason.response.data.message);
        }
      });
  }
  
  function checkTobuy(id) {
    console.log(id);
    for (let i = 0; i < tobuys.length; ++i) {
      let tobuy = tobuys[i];
      if (tobuy.itemid == id) {
        axios
          .post(apiBaseUrl + "edititem", {itemid: id, isCompleted: !tobuy.isCompleted, summary:tobuy.title})
          .then(function (response) {
            fetchList();
          }).catch(reason => {
            if (reason.response.status == 401) {
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

  return (
    <div>
      <AppBar position='fixed'>
        <Typography variant="h5" align="center" className={classes.header}>Grocery List</Typography>
      </AppBar>
      <Toolbar />
      
      <TobuyForm addTobuy={addTobuy}  />
      <TobuyList
        tobuys={tobuys}
        checkTobuy={checkTobuy}
        deleteTobuy={deleteTobuy}
      />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Link to='/lists'>
            <IconButton edge="start" color="inherit" className={classes.homeButton}>
              <Home />
            </IconButton>
          </Link>
          <IconButton edge="end"  color="inherit" className={classes.shareButton}>
              <Share onClick={goToShare} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
