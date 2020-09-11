import MuiThemeProvider from "material-ui/styles/MuiThemProvider";
import AppBar from "material-ui/AppBar";
import RaisebButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Axios from "axios";

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
          <>
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
          </>
        </MuiThemeProvider>
      </div>
    );
  }
}
const style = {margin: 15,};
export default Login;

handleClick(event) {
  const apiBaseUrl = "http://localhost:4000/api/";
  let content={
    "email":this.state.username,
    "password":this.state.password,
  }
  axios.post(apiBaseUrl+'login', content)
  .then(function (response) {console.log(response);
  if(response.data.code == 200) {console.log("Login successfull");
  let uploadScreen=[];
  uploadScreen.push(<UploadScreen appContext={this.props.appContext} />);
  this.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen});
}
else if(response.data.code == 204) {
  console.log("Username password do not match");
  alert("username password do not match")
}
else{
  console.log("Username does not exists");
  alert("Username does not exist");
}
})
.catch(function (error) {
  console.log(error);
});
}

