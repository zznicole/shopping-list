import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import React, { Component } from "react";
import axios from "axios";
import { withRouter } from 'react-router';
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

const styles = (theme) => ({
  "@global": {
    body: {
      backgroundImage: "url('/OSL-bg.png')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
      height: "100%",
    },
    html: {
      height: "100%",
    },
    "#componentWithId": {
      height: "100%",
    },
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      keepLoggedIn: false
    };
  }

  handleClick(event) {
    const apiBaseUrl = "/";
    let self = this;
    let payload = {
      userid: self.state.username,
      password: self.state.password,
      keepLoggedIn: self.state.keepLoggedIn
    };

    axios
      .post(apiBaseUrl + "login", payload)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Login successful");
          self.props.history.push('/lists');
        } else if (response.status === 401) {
          console.log("Error logging in");
          alert("Error logging in");
          self.props.history.push('/');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <CssBaseline />
          <div >
            
            <div style={{
        position: 'absolute', left: '50%', top: '40%',
        transform: 'translate(-50%, -50%)'
    }}>
            
              <TextField
                hintText="Enter your Username"
                id="standard-basic"
                label="Standard"
                floatingLabelText="Username"
                autoComplete="off"
                autoFocus
                onChange={(event, newValue) =>
                  this.setState({ username: newValue })
                }
              />
              <br />
              <TextField
                type="password"
                hintText="Enter your Password"
                id="standard-basic"
                label="Standard"
                floatingLabelText="Password"
                autoComplete="off"
                onChange={(event, newValue) =>
                  this.setState({ password: newValue })
                }
              />
              <br />
              <RaisedButton
                label="LOG IN"
                primary={true}
                style={style}
                onClick={(event) => this.handleClick(event)}
              />
              <Checkbox
                checked={this.state.keepLoggedIn}
                onChange={(event, newValue) =>
                  this.setState({ keepLoggedIn: !this.state.keepLoggedIn })}
              />
            </div>

          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

const style = { margin: 15 };
export default withStyles(styles)(withRouter(Login));
