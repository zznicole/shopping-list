import React from 'react';
import { useState, useEffect } from 'react';
import Lists from './Lists';

import { makeStyles } from '@material-ui/core/styles';
import { Typography, AppBar, Toolbar, Button, Fab} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import axios from "axios";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  topBar: {
    fontSize: 16,
    backgroundColor: '#00bcd4',

  },

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

  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
}));

let fetchingLists = false;

export default function ListScreen() {

  const classes = useStyles();
  const [lists, setLists] = useState([]);
  
  const apiBaseUrl = "/";
  const history = useHistory();
  
  function fetchLists() {
    axios
      .get(apiBaseUrl + "userlists")
      .then(function (response) {
        try {
          console.log("ok");
          fetchingLists = true;
          setLists(response.data.result);
        } catch (e) {
          console.log(e);
        }
      }).catch(reason => {
        history.push('/');
      });
  }

  useEffect(() => {
    if (!fetchingLists) {
      fetchLists();
    } else {
      fetchingLists = false;
    }
  });
  
  
  // mark as completed
  const checkList = (id) => {
    console.log(id);
    setLists(
      lists.map((list) => {
        if (list.id === id) {
          list.isCompleted = !list.isCompleted;
        }
        console.log(list.isCompleted);
        return list;
      }),
    );
  };
  
  function rmList(id) {
    axios
      .post(apiBaseUrl + "rmlist", {listid: id})
      .then(function (response) {
          fetchLists();
        }).catch(reason => {
          history.push('/');
        });
  }
  
  const deleteList = (id) => {
    rmList(id);
  };
  
  function createList(title) {
    axios
      .post(apiBaseUrl + "createlist", {summary: title, description: ""})
      .then(function (response) {
        history.push('/list/'+response.data.result.listid);
      }).catch(reason => {
        history.push('/');
      });
  }
  
  // Add a list
  const addList = (event) => {
    createList("New list");
  };
  const goToList = (id) => {
    history.push('/list/'+id);
  };
  
  const goToLogin = () => {
    alert('You are logging out.');
    axios
      .get(apiBaseUrl + "logout");
    history.push('/');
  }
  
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar className={classes.topBar}>
          <Typography variant="h5" align="center" className={classes.header}>My Shopping Lists</Typography>
          <Button variant="outlined" onClick={goToLogin}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Lists
        lists={lists || []}
        checkL={checkList}
        deleteList={deleteList}
        goToList={goToList}
      />
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <Fab color="secondary" className={classes.fabButton}>
            <Add
              onClick={(event) => addList(event)}
            />
          </Fab>
        </Toolbar>
      </AppBar>
    </div>

  );
}

