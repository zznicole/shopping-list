import MuiThemeProvider from "material-ui/styles/MuiThemProvider";
import AppBar from "material-ui/AppBar";
import RaisebButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";

class Login extends Componet {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <AppBar title="login" />
          <TextField
            hintText="Enter your Username"
            floatingLabelText="Username"
            onChange={(event, newValue) =>
              this.setState({ username: newValue })
            }
          />
        </MuiThemeProvider>
      </div>
    );
  }
}
