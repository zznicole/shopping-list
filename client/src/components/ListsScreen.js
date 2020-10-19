import React from 'react';
import { v4 } from 'uuid';
import { useState } from 'react';
import Lists from './Lists';
import TobuyListScreen from './TobuyListScreen';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, AppBar, Toolbar, Fab} from '@material-ui/core';
import { Add } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  appBar: {
    // position: 'fixed',
    // color: 'primary',
    top: 'auto',
    bottom: 0,
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

export default function ListScreen() {

  const classes = useStyles();
  const [lists, setLists] = useState([
    {id: v4(),
      title: "list one",
      subtitle: "Tomatoes, patatoes",
      isCompleted: false},
      
    {id: v4(),
      title: "list two",
      subtitle: "house hallway stool, binocollar",
      isCompleted: false},

    {id: v4(),
      title: "list two",
      subtitle: "nice shirts, wool outwear",
      isCompleted: false},
  ]);

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
   
  //delete a list
  const deleteList = (id) => {
    setLists(lists.filter((list) => list.id !== id));
  };

  // Add a list
  const addList = () => {
    const newList = {
      id: v4(),
      title: "New list",
      isCompleted: false,
    };
    setLists([...lists, newList]);
  };
    
 

  return (
    <div>
      <Paper square >
        <Typography variant="h5" align="center">My shopping lists</Typography>
      </Paper>
      <Lists
        lists={lists}
        checkL={checkList}
        deleteList={deleteList}
      />
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <Link to='/TobuyListScreen'>
            <Fab color="secondary" className={classes.fabButton}>
              <Add />
            </Fab>
          </Link>
        </Toolbar>
      </AppBar>
    </div>

  );
}

