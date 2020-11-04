import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";

import Login from "./Login";
import Signup from "./Signup";

class Loginscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      Loginscreen: [],
      loginmessage: "",
      buttonLabel: "Sign up",
      isLogin: true,
    };
  }
  componentWillMount() {
    let loginscreen = [];
    loginscreen.push(
      <Login parentContext={this} appContext={this.props.parentContext} />,
    );
    let loginmessage = "Not signed up yet? Sign up now!";
    this.setState({ loginscreen: loginscreen, loginmessage: loginmessage });
  }

  handleClick(event) {
    let loginmessage;
    if (this.state.isLogin) {
      let loginscreen = [];
      loginscreen.push(<Signup parentContext={this} />);
      loginmessage = "Already registered? Go to login!";
      this.setState({
        loginscreen: loginscreen,
        loginmessage: loginmessage,
        buttonLabel: "LOG IN",
        isLogin: false,
      });
    } else {
      var loginscreen = [];
      loginscreen.push(<Login parentContext={this} />);
      loginmessage = "Not registered yet? Go to signup!";
      this.setState({
        loginscreen: loginscreen,
        loginmessage: loginmessage,
        buttonLabel: "SIGN UP",
        isLogin: true,
      });
    }
  }

  render() {
    return (
      <div className="loginscreen" >
        {this.state.loginscreen}
        <div style={{
        position: 'absolute', left: '50%', top: '80%',
        transform: 'translate(-50%, -50%)'}} >
          {this.state.loginmessage}
          <MuiThemeProvider>
            <div>
              <RaisedButton
                label={this.state.buttonLabel}
                primary={true}
                style={style}
                onClick={(event) => this.handleClick(event)}
              />
            </div>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

const style = {
  margin: 15,
};

export default Loginscreen;
