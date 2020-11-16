import React from "react";
import { Link } from 'react-router-dom';
import {
  FormControl,
  Container,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  screen: {
    backgroundColor: "#00bcd4",
    // backgroundImage: "url'./assets/OSL-bg.png'",
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
  },

  form: {
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },

  button: {
    width:'100%',
  }
}));

export default function LoginForm() {
  const classes = useStyles();
  return (
    <Container className={classes.screen}>
      <form className={classes.form}>
        <FormControl>
        <TextField
            type="Name"
            required
            variant="standard"
            size="medium"
            label="First Name"
            floatingLabelText="First Name"
          />
          <br />
          <TextField
            type="Name"
            required
            variant="standard"
            size="medium"
            label="Last Name"
            floatingLabelText="Last Name"
          />
          <br />
          <TextField
            type="Email"
            required
            variant="standard"
            size="medium"
            label="Email"
            floatingLabelText="Email"
          />
          <br />
          <TextField
            type="password"
            required
            variant="standard"
            size="medium"
            label="Password"
            floatingLabelText="Password"
          />
          <br />
          <Button variant="contained" color="primary">
            SIGN UP
          </Button>
          <br />
          <br />
          <p>Already signed up? Time to Log in.</p>
          <Link to='/'>
            <Button variant="contained" className={classes.button} color="primary">
              lOG IN
            </Button>
          </Link>
        </FormControl>
      </form>
    </Container>
  );
}
