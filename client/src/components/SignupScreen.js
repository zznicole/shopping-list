import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  FormControl,
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Icon,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  screen: {
    backgroundImage: "url('/OSL-bg.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    display: "flex",
    minHeight: "100vh",
  },

  formContainer: {
    maxWidth: "80%",
    maxHeight: "70%",
    backgroundColor: "#FCF9d4",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    display: "flex",
    boxShadow: "8px 16px 9px rgba(0, 0, 0, 0.25)",
  },

  heading: {
    fontFamily: "Gloria Hallelujah",
    fontStyle: "bold",
    fontWeight: "700",
    color: "#2D1E2F",
    fontSize: "22",
  },

  form: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "3rem",
    paddingBottom: "2rem",
    position: "relative",
  },

  pinIcon: {
    position: "absolute",
    top: "0",
    right: "50%",
  },

  loginBtn: {
    width: "100%",
  },

  signupBtn: {
    width: "100%",
  },
}));

export default function SignupScreen(props) {
  const classes = useStyles();
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState();

  const apiBaseUrl = "/";

  const history = useHistory();

  const onClickHandler = (event) => {
    let payload = {
      userid: email,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    };
    axios
      .post(apiBaseUrl + "signup", payload)
      .then(function (response) {
        console.log(response);
        if (response.data.code === 200) {
          history.push("/verify/postreg");
        } else {
          setMessage(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function Message() {
    if (message.length == 0) {
      return <>
      <br/>
      <br/>
      </>;
    } else {
      return <>
    <Typography color="colorError">
    {message}
    </Typography>
      </>;
    }
  }
  
  return (
    <div className={classes.screen}>
      <Container className={classes.formContainer}>
        <form className={classes.form}>
          <FontAwesomeIcon className={classes.pinIcon} icon={faThumbtack} color="red" transform={{ rotate: 42 }}/>
          <h1 className={classes.heading}>Our Shopping List</h1>
            <FormControl>
  <TextField
    type="text"
    required
    autoComplete="off"
    variant="standard"
    size="medium"
    label="First Name"
    floatingLabelText="First Name"
    onChange={(e) => setFirstname(e.target.value)}
  />
  <br />
  <TextField
    type="text"
    required
    autoComplete="off"
    variant="standard"
    size="medium"
    label="Last Name"
    floatingLabelText="Last Name"
    onChange={(e) => setLastname(e.target.value)}
  />
  <br />
  <TextField
    type="email"
    required
    autoComplete="off"
    variant="standard"
    size="medium"
    label="Email"
    floatingLabelText="Email"
    onChange={(e) => setEmail(e.target.value)}
  />
  <br />
  <TextField
    type="password"
    required
    autoComplete="off"
    variant="standard"
    size="medium"
    label="Password"
    floatingLabelText="Password"
    onChange={(e) => setPassword(e.target.value)}
    backgroundColor="#FCF6B1"
  />
  <br />
  <Button
    className={classes.loginBtn}
    variant="contained"
    color="secondary"
    onClick={onClickHandler}
  >
    Sign Up
  </Button>
    
    
              <br />
              <Message />
              <br />
              <p>Already signed up?</p>
            <Link to="/" style={{textDecoration:'none'}}>
              <Button
                className={classes.signupBtn}
                variant="outlined"
                color="secondary"
              >
                Log In
              </Button>
            </Link>
          </FormControl>
        </form>
      </Container>
    </div>
  );
}
