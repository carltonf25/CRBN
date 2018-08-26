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
      <nav className="App-header navbar navbar-expand-lg navbar-light">
        {/*<header className="App-header">*/}
        <h1 className="App-title" >CRBN</h1>
        <button className="navbar-toggler" type="button" data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"><i class="fa fa-navicon"></i></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {path === "/leaderboards"
              ? <li className="nav-item"> <a className="appBtn nav-link"><Link to="/" >Profile</Link></a></li>
              : <li className="nav-item"><a className="appBtn nav-link"><Link to="/leaderboards" >Leaderboard</Link></a></li>}
            {loggedIn
              ? <li className="nav-item"><a className="appBtn nav-link" onClick={this.logout.bind(this)}><Link to="/">Log Out</Link></a> </li>
              : <li className="nav-item"> <a className="nav-link appBtn"><Link to="/"> Log In</Link></a></li>}
          </ul>
        </div>
        {/*</header>*/}
      </nav>

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