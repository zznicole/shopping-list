import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";

import Login from "./Login";
import Signup from "./Signup";
import {Button, CardContent, Toolbar, Typography} from "@material-ui/core";
import {useHistory, useParams} from "react-router-dom";
import AppBar from "material-ui/AppBar";
import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundImage: "url('/grocery.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    height: "100%",
  },
  
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

export default function VerifyScreen() {
  const classes = useStyles();
  
  const history = useHistory();
  const { status } = useParams();
  
  const goToLogin = () => {
    history.push('/');
  }
  
  let title = "";
  let message = "";
  if (status == 's') {
    title = "Congratulations!";
    message = "Your account has been created.";
  } else {
    title = "Error!";
    message = "We were not able to verify your account.";
  }
  
  return (
    <div className="loginscreen">
        <MuiThemeProvider>
          <CssBaseline />
          <Toolbar className={classes.topBar}>
            <Typography variant="h5" align="center" className={classes.header}>Our Shopping List Online</Typography>
          </Toolbar>
          <div align={'center'} >
            <br/><br/><br/><br/><br/>
            <Typography variant="h5" >
              {title}
            </Typography>
            <Typography variant="body" >
              {message}
            </Typography>
          </div>
          <div align={'center'}>
            <br/>
            <RaisedButton
              label={"Go to LOGIN"}
              primary={true}
              style={style}
              onClick={(event) => goToLogin()}
            />
          </div>
        </MuiThemeProvider>
    </div>
  );
}

const style = {
  margin: 15,
};

