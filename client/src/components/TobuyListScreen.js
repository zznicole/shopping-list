import React from 'react';
import { v4 } from 'uuid';
import { useState } from 'react';
import TobuyList from './TobuyList';
import TobuyForm from './TobuyForm';
import ListsScreen from './ListsScreen';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, AppBar, Toolbar, Fab} from '@material-ui/core';
import { Home } from '@material-ui/icons'

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

export default function TobuyListScreen() {
  const classes = useStyles();
  const [tobuys, setTobuys] = useState([]);

  // mark as completed
  const checkTobuy = (id) => {
    console.log(id);
    setTobuys(
      tobuys.map((tobuy) => {
        if (tobuy.id === id) {
          tobuy.isCompleted = !tobuy.isCompleted;
        }
        console.log(tobuy.isCompleted);
        return tobuy;
      }),
    );
  };
   
  //delete a tobuy
  const deleteTobuy = (id) => {
    setTobuys(tobuys.filter((tobuy) => tobuy.id !== id));
  };

  // Add a tobuy
  const addTobuy = (text) => {
    const newTobuy = {
      id: v4(),
      title: text,
      isCompleted: false,
    };
    setTobuys([...tobuys, newTobuy]);
  };

  return (
    <div>
      <Paper square>
        <Typography variant="h5" align="center" padding="16" className={classes.header}>Grocery List</Typography>
      </Paper>
      <TobuyForm addTobuy={addTobuy} />
      <TobuyList
        tobuys={tobuys}
        checkTobuy={checkTobuy}
        deleteTobuy={deleteTobuy}
      />
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <Link to='/ListsScreen'>
            <Fab color="secondary" className={classes.fabButton}>
              <Home />
            </Fab>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
