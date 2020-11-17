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

const useStyles = makeStyles((theme) => ({
  screen: {
    backgroundColor: "#00BCD4",
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
    backgroundColor: "#FCF6B1",
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
  },

  loginBtn: {
    width: "100%",
   
  },

  signupBtn: {
    width: "100%",
  },
}));

export default function LoginScreen(props) {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState();
  const history = useHistory();

  const apiBaseUrl = "/";
  let payload = {
    userid: username,
    password: password,
    keepLoggedIn: keepLoggedIn,
  };

  const onClickHandler = (event) => {
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
          <FontAwesomeIcon icon="thumbtack" rotation={45} />
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
            <FormControlLabel control={<Checkbox
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn()} />}
              label="Keep me logged in."
            />
            <br />
            <p>Not signed up yet? Sign up now!</p>
            <Link to="/signup" underline="none">
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
