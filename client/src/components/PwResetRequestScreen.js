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

export default function PwResetRequestScreen(props) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const history = useHistory();
  const apiBaseUrl = "/";

  const onClickHandler = (event) => {
    let payload = {
      userid: email,
      email: email,
    };
    axios
      .post(apiBaseUrl + "passwordresetrequest", payload)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Send password reset request successful");
          history.push("/lists");
        } else if (response.status === 401) {
          console.log("Error sending");
          alert("Error sending request");
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
          <FontAwesomeIcon className={classes.pinIcon} icon={faThumbtack} color="red" transform={{ rotate: 42 }}/>
          <h1 className={classes.heading}>Forgot Your password?</h1>
          <h3>Don't worry, just fill in your Email, click Request Password Reset, we'll send you a link to 
            reset your password.</h3>
          <FormControl>
            <br />
            <TextField
              type="Email"
              required
              autoComplete="off"
              variant="standard"
              size="medium"
              label="Email"
              floatingLabelText="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <Button
              className={classes.loginBtn}
              variant="contained"
              color="secondary"
              onClick={onClickHandler}
            >
              Request Password Reset
            </Button>
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