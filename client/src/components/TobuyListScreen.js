import React, {useEffect} from 'react';
import { v4 } from 'uuid';
import { useState } from 'react';
import TobuyList from './TobuyList';
import TobuyForm from './TobuyForm';
import ListsScreen from './ListsScreen';
import { Link, useParams, useLocation } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, AppBar, Toolbar, Fab} from '@material-ui/core';
import { Home } from '@material-ui/icons'
import axios from "axios";

const apiBaseUrl = "/";

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: 24,
    backgroundColor: '#00bcd4',
    color: '#ffffff',
    padding: 20,

  },
  
  appBar: {
    // position: 'fixed',
    // color: 'primary',
    top: 'auto',
    bottom: 0,
    backgroundColor: '#00bcd4',
  },

  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
}));

let fetchingList = false;

export default function TobuyListScreen() {
  const classes = useStyles();
  const [tobuys, setTobuys] = useState([]);
  const { listid } = useParams();
  
  function fetchList() {
    axios
      .get(apiBaseUrl + "getlist?listid=" + listid)
      .then(function (response) {
        try {
          console.log(response.data.code);
          if (response.data.code === 200) {
            console.log(response.data.result);
            
            fetchingList = true;
            setTobuys(response.data.result.items);
          }
        } catch (e) {
          console.log(e);
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
        try {
          console.log(response.data.code);
          if (response.data.code === 200) {
            console.log(response.data);
            
            fetchList();
          }
        } catch (e) {
          console.log(e);
        }
      });
  }
  
  function deleteTobuy(id) {
    console.log(id);
    axios
      .post(apiBaseUrl + "rmitem", {listid: listid, itemid: id})
      .then(function (response) {
        try {
          console.log(response.data.code);
          if (response.data.code === 200) {
            console.log(response.data);
            
            fetchList();
          }
        } catch (e) {
          console.log(e);
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
            try {
              console.log(response.data.code);
              if (response.data.code === 200) {
                console.log(response.data);
          
                fetchList();
              }
            } catch (e) {
              console.log(e);
            }
          });
        break;
      }
    }
  }
  
  return (
    <div>
      <Paper square>
        <Typography variant="h5" align="center" padding="16" className={classes.header}>Grocery List</Typography>
      </Paper>
      <TobuyForm addTobuy={addTobuy} position="fixed" />
      <TobuyList
        tobuys={tobuys}
        checkTobuy={checkTobuy}
        deleteTobuy={deleteTobuy}
      />
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <Link to='/lists'>
            <Fab color="secondary" className={classes.fabButton}>
              <Home />
            </Fab>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
