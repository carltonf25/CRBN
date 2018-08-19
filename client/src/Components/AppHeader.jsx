import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

class AppHeader extends Component {

  constructor() {
    super();
    this.state = {
      loggedIn: false
    }
  }

  render() {
    let { loggedIn } = this.state;
    let path = window.location.pathname

    return (
  
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">CRBN</h1>

          {loggedIn ? <button className="appBtn" onClick={this.logout.bind(this)}>Log Out</button> :
            <a href='/'><button className="appBtn">Log In</button></a>}
          {path === "/leaderboards" ? <button className="appBtn"><Link to="/" >Profile</Link></button> :
          <button className="appBtn"><Link to="/leaderboards" >Leaderboards</Link></button>}
        </header>
      </div>

    )
  }

  componentWillMount() {
    axios.get('/test')
      .then((res) => {
        this.setState({ loggedIn: res.data.loggedIn })
      })
  }

  logout(event) {
    event.preventDefault();
    axios({ url: '/logout', method: 'get' })
      .then((res) => { this.setState({ loggedIn: res.loggedIn }) })
      .then(err => console.error(err))
      .then(window.location.reload())
  }
}

export default AppHeader; 