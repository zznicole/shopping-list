import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import React, { Component } from "react";
import axios from "axios";
import UploadScreen from "./UploadScreen";

import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
	"@global": {
		body: {
			backgroundImage: "url('/logo192.png')",
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center center",
			backgroundSize: "cover",
			backgroundAttachment: "fixed",
			height: "100%"
		},
		html: {
			height: "100%"
		},
		"#componentWithId": {
			height: "100%"
		}
	}
});


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleClick(event) {
    const apiBaseUrl = "http://localhost:4000/api/";
    let self = this;
    let payload = {
      email: self.state.username,
      password: self.state.password,
    };

    axios
      .post(apiBaseUrl + "login", payload)
      .then(function (response) {
        console.log(response);
        if (response.data.code === 200) {
          console.log("Login successfull");
          let uploadScreen = [];
          uploadScreen.push(
            <UploadScreen appContext={this.props.appContext} />
          );
          this.props.appContext.setState({
            loginPage: [],
            uploadScreen: uploadScreen,
          });
        } else if (response.data.code === 204) {
          console.log("Username password do not match");
          alert("username password do not match");
        } else {
          console.log("Username does not exists");
          alert("Username does not exist");
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
          <div>
            <AppBar title="login" />
            <TextField
              hintText="Enter your Username"
              floatingLabelText="Username"
              onChange={(event, newValue) =>
                this.setState({ username: newValue })
              }
            />
            <br />
            <TextField
              type="password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              onChange={(event, newValue) =>
                this.setState({ password: newValue })
              }
            />
            <br />
            <RaisedButton
              label="Submit"
              primary={true}
              style={style}
              onClick={(event) => this.handleClick(event)}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

const style = { margin: 15 };
export default withStyles(styles)(Login);