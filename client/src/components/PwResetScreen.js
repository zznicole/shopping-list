import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  FormControl,
  Container,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

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

export default function PwResetScreen(props) {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const history = useHistory();
  const apiBaseUrl = "/";

  const onClickHandler = (event) => {
    let payload = {
      password: password,
      confirm_password: password,
    };
    axios
      .post(apiBaseUrl + "passwordreset", payload)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Reset password successful");
          history.push("/");
        } else if (response.status === 401) {
          console.log("Error resetting password");
          alert("Error resetting password");
          history.push("/passwordreset:request");
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
          <FontAwesomeIcon className={classes.pinIcon} icon={faThumbtack} color="red" transform={{ rotate: 42 }}/>
          <h1 className={classes.heading}>Reset Your Password</h1>
          <FormControl>
          <br />
            <TextField
              type="password"
              required
              autoComplete="off"
              variant="standard"
              size="medium"
              label="New Password"
              floatingLabelText="New Password"
              onChange={(e) => setPassword(e.target.value)}
              backgroundColor="#FCF6B1"
            />
            <br />
            <TextField
              type="password"
              required
              autoComplete="off"
              variant="standard"
              size="medium"
              label="Confirm New Password"
              floatingLabelText="Confirm New Password"
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
              Reset Password
            </Button>
            <br />
          </FormControl>
        </form>
      </Container>
    </div>
  );
}