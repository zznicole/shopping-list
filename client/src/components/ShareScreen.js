import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { FormControl, Container, TextField, AppBar, Toolbar, Typography, IconButton, Fab } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import TobuyList from "./TobuyList";

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

  backButton: {
    marginLeft: theme.spacing(1),
    color: '#ffffff',
  },

  
}));

let doNotFetch = false;
export default function TobuyForm({ addTobuy }) {
  const classes = useStyles();
  const [text, setText] = useState('');
  const [shares, setShares] = useState([]);
  const { listid } = useParams();
  const history = useHistory();

  const backToList = () => {
    history.goBack();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    shareWithUser(text);
  };
  
  
  function fetchList() {
    axios
      .get(apiBaseUrl + "getshares?listid=" + listid)
      .then(function (response) {
        try {
          doNotFetch = true;
          setShares(response.data.result.friends);
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
    if (!doNotFetch) {
      fetchList();
    } else {
      doNotFetch = false;
    }
  });
  
  function shareWithUser(email) {
    axios
      .post(apiBaseUrl + "sharelist", {listid: listid, userid: email})
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
  
  function shareWithUserById(id) {
    axios
      .post(apiBaseUrl + "sharelistbyid", {listid: listid, userid: id})
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
  
  function removeShare(id) {
    axios
      .post(apiBaseUrl + "rmshare", {listid: listid, userid: id})
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
            onChange={ (e) => {doNotFetch = true; setText(e.target.value)}}
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
      <TobuyList
        tobuys={shares}
        checkTobuy={shareWithUserById}
      />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
            <IconButton edge="start" color="inherit" className={classes.backButton} onClick={backToList}>
              <ArrowBack />
            </IconButton>
        </Toolbar>
      </AppBar>
    </Container>
  );
}