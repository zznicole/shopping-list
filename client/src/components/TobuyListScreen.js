import React, { useEffect } from 'react';
import { useState } from 'react';
import TobuyList from './TobuyList';
import TobuyForm from './TobuyForm';
import { Link, useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import EdiText from 'react-editext';
import { Autorenew, Home, SettingsOutlined, Share } from '@material-ui/icons'
import axios from "axios";

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
  const [tobuys, setTobuys] = useState([]);
  const [listTitle, setListTitle] = useState("");
  const { listid } = useParams();
  const history = useHistory();
  
  function fetchList() {
    axios
      .get(apiBaseUrl + "getlist?listid=" + listid)
      .then(function (response) {
        try {
          fetchingList = true;
          setTobuys(response.data.result.items);
          setListTitle(response.data.result.summary);
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
  
  // add a list title
  function editList(title) {
    axios
      .post(apiBaseUrl + "editlist", {listid: listid, summary: title, description: "", done: false})
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

  // give a name to the list
  function onSave(val) {
    console.log('Edited Value ->', val);
    editList(val);
  }

 // add a tobuy item to the list
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
      <AppBar position="fixed" style={{backgroundColor:"#00bcd4"}}>
        <EdiText variant="h5" type="text" value="NEW LIST" className={classes.header} onSave={onSave} />
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
