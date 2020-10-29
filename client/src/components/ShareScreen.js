import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { FormControl, Container, TextField, AppBar, Toolbar, Typography, IconButton, Fab } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';


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

  backButton: {
    marginLeft: theme.spacing(1),
    color: '#ffffff',
  },

  
}));

export default function TobuyForm({ addTobuy }) {
  const classes = useStyles();
  const history = useHistory();
  const [text, setText] = useState('');

  const goToList = (id) => {
    history.push('/list/'+id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // addTobuy(text);
  };

  return (
    <Container>
      <AppBar position='fixed'>
        <Typography variant="h5" align="center" className={classes.header}>Grocery List</Typography>
      </AppBar>
      <Toolbar />
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth={true} style={{ marginTop: 16 }}>
          <TextField
            id="outlined-basic"
            label="Type username here"
            required={true}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Fab
            variant="contained"
            color="secondary"
            type="submit"
            aria-label="share"
            style={{ marginTop: 5 , maxWidth: "30%"}}
          >
            Share
          </Fab>
        </FormControl>
      </form>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
            <IconButton edge="start" color="inherit" className={classes.backButton} onClick={goToList}>
              <ArrowBack />
            </IconButton>
        </Toolbar>
      </AppBar>
    </Container>
  );
}