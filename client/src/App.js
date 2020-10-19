import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import "./App.css";
import Loginscreen from "./Loginscreen";
import ListsScreen from './components/ListsScreen';
import TobuyListScreen from './components/TobuyListScreen';
// import injectTapEventPlugin from "react-tap-event-plugin";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginPage: [],
      uploadScreen: [],
    };
  }
  componentWillMount() {
    let loginPage = [];
    loginPage.push(<Loginscreen parentContext={this} />);
    this.setState({ loginPage: loginPage });
  }

  render() {
    return (
      <BrowserRouter>
        {/* <div className="App">
          {this.state.loginPage}
          {this.state.uploadScreen}
        </div> */}
        <Switch>
          <Route path="/" exact component={Loginscreen} />
          <Route path="/ListsScreen" component={ListsScreen} />
          <Route path="/TobuyListScreen" component={TobuyListScreen} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const style = {
  margin: 15,
};

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         {/* <img src={logo} className="App-logo" alt="logo" /> */}

//         <h1>Shopping List</h1>
//         <Button className="signup-btn" variant="contained" color="secondary">
//           Sign Up
//         </Button>
//         <Button
//           className="login-btn"
//           variant="outlined"
//           color="primary"
//           onClick={(event) => {
//             Login;
//           }}
//         >
//           Log In
//         </Button>
//         {/* <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a> */}
//       </header>
//     </div>
//   );
// }

export default App;
