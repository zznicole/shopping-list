import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { FormControl, Container, TextField, Button, CssBaseline, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  screen: {
    backgroundColor: "#00bcd4",
    backgroundImage: "url('/OSL-bg.png')",
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
  },

  form: {
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
  },

  button: {
    width:'100%',
  }
}));

export default function LoginScreen(props) {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState();
  const history = useHistory();

  const apiBaseUrl = "/";
  let payload = {
    userid: username,
    password: password,
    keepLoggedIn: keepLoggedIn
  };

  const onClickHandler= (event) => {
    axios
      .post(apiBaseUrl + "login", payload)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Login successful");
          history.push('/lists');
        } else if (response.status === 401) {
          console.log("Error logging in");
          alert("Error logging in");
          history.push('/');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <Container className={classes.screen}>
     <CssBaseline />
      <form className={classes.form}>
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
          />
          <br />
          <Button variant="contained" color="primary" onClick={onClickHandler}>
            LOG IN
          </Button>
          <br />
          <Checkbox checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn()} label="Keep me logged in." />

          <br />
          <p>Not signed up yet? Sign up now!</p>
          <Link to="/signup">
            <Button variant="contained"  className={classes.button} color="primary">
              SIGN UP
            </Button>
          </Link>
        </FormControl>
      </form>
    </Container>
  );
}
