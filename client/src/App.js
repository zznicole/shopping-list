import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import "./App.css";

import LoginScreen from "./components/LoginScreen";
import SignScreen from "./components/SignupScreen";
import VerifyScreen from "./VerifyScreen";
import ListsScreen from './components/ListsScreen';
import TobuyListScreen from './components/TobuyListScreen';
import ShareScreen from './components/ShareScreen';

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
    loginPage.push(<LoginScreen parentContext={this} />);
    this.setState({ loginPage: loginPage });
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={LoginScreen} />
          <Route path="/signup" exact component={SignScreen} />

          <Route path="/lists" component={ListsScreen} isPrivate />
          <Route path="/list/:listid" component={TobuyListScreen} isPrivate/>
          <Route path="/share/:listid" component={ShareScreen} isPrivate/>
          <Route path="/verify/:status" component={VerifyScreen} isPrivate/>

          <Route component={LoginScreen} />
        </Switch>
      </BrowserRouter>
    );
  }
}


export default App;