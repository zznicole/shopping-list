import React from "react";
import PropTypes from "prop-types";
import Login from "./Login";
import clsx from "clsx";
// import logo from './logo.svg';
import Button from "@material-ui/core/Button";

import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}

        <h1>Shopping List</h1>
        <Button className="signup-btn" variant="contained" color="secondary">
          Sign Up
        </Button>
        <Button
          className="login-btn"
          variant="outlined"
          color="primary"
          onClick={(event) => {
            Login;
          }}
        >
          Log In
        </Button>
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
