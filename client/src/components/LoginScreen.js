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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";

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
    paddingTop: "2rem",
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
  forgotPasswoodBtn: {
    fontSize: "8",
  },
}));

export default function LoginScreen(props) {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState();
  const history = useHistory();

  const apiBaseUrl = "/";

  let loggedIn = document.cookie.replace(
    /(?:(?:^|.*;\s*)loggedIn\s*=\s*([^;]*).*$)|^.*$/,
    "$1",
  );
  if (loggedIn) {
    history.push("/lists");
  }

  const onClickHandler = (event) => {
    let payload = {
      userid: username,
      password: password,
      keepLoggedIn: true,
    };
    axios
      .post(apiBaseUrl + "login", payload)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Login successful");
          history.push("/lists");
        } else if (response.status === 401) {
          console.log("Error logging in");
          alert("Error logging in");
          history.push("/");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className={classes.screen}>
      <Container className={classes.formContainer}>
        <form className={classes.form}>
          <FontAwesomeIcon
            className={classes.pinIcon}
            icon={faThumbtack}
            color="red"
            transform={{ rotate: 42 }}
          />
          <h1 className={classes.heading}>Our Shopping List</h1>
          <FormControl>
            <TextField
              type="Email"
              required
              autoComplete="off"
              variant="standard"
              size="medium"
              label="Email"
              floatingLabelText="Email"
              onChange={(e) => setUsername(e.target.value)}
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
            <Link
              className={classes.forgotPasswoodBtn}
              to="/passwordresetrequest"
              color="primary"
            >
              Forgot Your Password?
            </Link>
            <br />
            <Button
              className={classes.loginBtn}
              variant="outlined"
              color="secondary"
              onClick={onClickHandler}
            >
              LOG IN
            </Button>
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={keepLoggedIn}
                  onChange={(event, newValue) =>
                    setKeepLoggedIn({ keepLoggedIn: !keepLoggedIn })
                  }
                />
              }
              label="Keep me logged in."
            />
            <br />
            <p>Not signed up yet? Sign up now!</p>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <Button
                className={classes.signupBtn}
                variant="contained"
                color="secondary"
              >
                SIGN UP
              </Button>
            </Link>
          </FormControl>
        </form>
      </Container>
    </div>
  );
}
