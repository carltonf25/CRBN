import React, { Component } from 'react';
import './App.css';

import axios from 'axios'
import Login from './Components/Login';
import UserProfile from './Components/UserProfile';


class App extends Component {
  constructor() {
    super();
    this.state = { loggedIn: false }
  }

  componentWillMount() {
    axios.get('/test')
    .then((res)=>{
      this.setState({loggedIn: res.data.loggedIn})
      console.log(this.state.loggedIn)
      console.log(res)
    })
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">CRBN</h1>
          { this.state.loggedIn !== false ? <a href="http://localhost:3001/logout">Log Out</a> : <a href="http://localhost:3001/login">Log In</a>  }          
        </header>
        <UserProfile loggedIn = {this.state.loggedIn}  />

        <Login className="login"></Login>
      </div>
    );
  }
}

export default App;
