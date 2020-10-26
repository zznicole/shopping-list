import React from 'react';
import { v4 } from 'uuid';
import { useState, useEffect } from 'react';
import Lists from './Lists';
import TobuyListScreen from './TobuyListScreen';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, AppBar, Toolbar, Fab} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import axios from "axios";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: 24,
    backgroundColor: '#00bcd4',
    color: '#ffffff',
    padding: 20,
    width: '100%',
    position: 'fixed',
    zIndex: 1,
    top: 0
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
          console.log(response.data.code);
          if (response.data.code === 200) {
            console.log(response.data.result);
  
            fetchingLists = true;
            setLists(response.data.result);
          }
        } catch (e) {
          console.log(e);
        }
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
        try {
          console.log(response.data.code);
          if (response.data.code === 200) {
            console.log(response.data.result);
  
            fetchLists();
          }
        } catch (e) {
          console.log(e);
        }
      });
  }
  
  const deleteList = (id) => {
    rmList(id);
    // setLists(lists.filter((list) => list.id !== id));
  };
  
  function createList(title) {
    axios
      .post(apiBaseUrl + "createlist", {summary: title, description: ""})
      .then(function (response) {
        try {
          console.log(response.data.code);
          if (response.data.code === 200) {
            console.log(response.data.result);
            history.push('/list/'+response.data.result.listid);
  
            // fetchLists();
          }
        } catch (e) {
          console.log(e);
        }
      });
  }
  
  // Add a list
  const addList = (event) => {
    createList("New list");
  };
  const goToList = (id) => {
    history.push('/list/'+id);
    // setLists(lists.filter((list) => list.id !== id));
  };
  
  
  
  return (
    <div>
      <Paper square position="fixed" >
        <Typography variant="h5" align="center" className={classes.header}>My Shopping Lists</Typography>
      </Paper>
      <Lists
        lists={lists}
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

