import React, { component } from "react";
import MuithemeProvider from "material-ui/styles/MuiThemeProvider";
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
      buttonLabel: "Sign UP",
      isLogin: true,
    };
  }
  componentWillMount() {
    let loginscreen = [];
    loginscreen.push(
      <Login parentContext={this} appContext={this.props.parentContext} />
    );
    let loginmessage = "Not Sign up yet, Sign up Now";
    this.setState({ loginscreen: loginscreen, loginmessage: loginmessage });
  }

  handleClick(event) {
    let loginmessage;
    if ((this.state, isLogin)) {
      let loginscreen = [];
      loginscreen.push(<Signup parentContext={this} />);
      loginmessage = "Already resgistered.Go to Login";
      this.setState({
        loginscreen: loginscreen,
        loginmessage: loginmessage,
        buttonLabel: "Login",
        isLogin: false,
      });
    } else {
      var loginscreen = [];
      loginscreen.push(<Login parentContext={this} />);
      loginmessage = "Not Registered yet.Go to registration";
      this.setState({
        loginscreen: loginscreen,
        loginmessage: loginmessage,
        buttonLabel: "Signup",
        isLogin: true,
      });
    }
  }

  render() {
    return (
      <div className="loginscreen">
        {this.state.loginscreen}
        <div>
          {this.state.loginmessage}
          <MuiThemeProvider>
            <div>
              <RasiedButton
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
