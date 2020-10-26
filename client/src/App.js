import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';

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

          <Route path="/lists" component={ListsScreen} isPrivate />
          <Route path="/list/:listid" component={TobuyListScreen} isPrivate/>

          <Route component={Loginscreen} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const style = {
  margin: 15,
};

export default App;
