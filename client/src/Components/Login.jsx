import React, { Component } from "react";
import axios from "axios";
import "../Login.css";
import LoginImg from "../LoginImg.js";
import LoginImg2 from "../LoginImg2.js";
import Zoom from "react-reveal/Zoom";
import { ScrollTo } from "react-scroll-to";
import ReallySmoothScroll from "really-smooth-scroll";
import FlexView from "react-flexview";
import FormattedText from "buildo-react-components/lib/FormattedText";

ReallySmoothScroll.shim();
const flexOne =
  "Using some basic inputs from your everyday life,\nwe show how your lifestyle affects the environment.\n";
const flexTwo =
  "Find events you can participate in to improve your score,\nor donate to a carbon emission reducing activity of your choice.\n";
const flexThree = "Share your score and see where you rank among others.\n";
const flexFour = "Sign up now!  ";

class Login extends Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      user: null,
      signupFormVisible: false
    };
  }

  render() {
    return (
      <div>
        <div className="login-form" style={LoginImg}>
          <Zoom>
            <div className="loginDescription">
              <h1>Track your annual carbon emmission output.</h1>
              <h4>
                Share your score / Improve your output / Shame your friends
              </h4>
            </div>
          </Zoom>

          {this.state.user ? (
            <br />
          ) : (
            // <div className="user">
            //     <span className="username">User: {this.state.user.username}</span>
            //     <button onClick={this.logout}>Log Out</button>
            // </div>
            <div className="user-form">
              <button
                className="loginRegisterSwitch"
                onClick={this.showSignupForm}
                disabled={this.state.signupFormVisible}
              >
                Register
              </button>
              <button
                className="loginRegisterSwitch"
                onClick={this.showLoginForm}
                disabled={!this.state.signupFormVisible}
              >
                Login
              </button>
              {this.state.signupFormVisible ? (
                <div>
                  <form id="registerForm" onSubmit={this.register}>
                    <h2>Register</h2>
                    <div className="form-field">
                      <label htmlFor="registerUsername">Username:</label>
                      <input name="registerUsername" type="text" required />
                    </div>
                    <div className="form-field">
                      <label htmlFor="registerPassword">Password:</label>
                      <input name="registerPassword" type="password" required />
                    </div>
                    <button className="appBtn" type="submit">
                      Register
                    </button>
                    <br />
                  </form>
                  <a href="/github/auth">
                    <button className="gitHubButton" type="submit">
                      GitHub
                    </button>
                  </a>
                </div>
              ) : (
                <div>
                  <form id="loginForm" onSubmit={this.login}>
                    <h2>Login</h2>
                    <div className="form-field">
                      <label htmlFor="username">Username:</label>
                      <input name="username" type="text" required />
                    </div>
                    <div className="form-field">
                      <label htmlFor="password">Password:</label>
                      <input name="password" type="password" required />
                    </div>
                    <button className="appBtn" type="submit">
                      Login
                    </button>
                  </form>
                  <a href="/github/auth">
                    <button className="gitHubButton" type="submit">
                      GitHub
                    </button>
                  </a>
                </div>
              )}
              <ScrollTo>
                {scroll => (
                  <a onClick={() => scroll(0, 2000)}>
                    <p className="learnMore">
                      <h4>Learn More</h4>
                      <i className="fas fa-chevron-circle-down fa-3x" />
                    </p>
                  </a>
                )}
              </ScrollTo>
            </div>
          )}
        </div>
        <div className="login-2nd" id="login-2nd" style={LoginImg2}>
          <Zoom>
            <FlexView height={200} marginTop={40}>
              <FormattedText>{flexOne}</FormattedText>
              <i className="car fas fa-car-side fa-3x" />
            </FlexView>
            <FlexView height={200} marginTop={40}>
              <FormattedText>{flexTwo}</FormattedText>
              <i className="tree fas fa-seedling fa-3x" />
            </FlexView>
            <FlexView height={200} marginTop={40}>
              <FormattedText>{flexThree}</FormattedText>
              <i className="star far fa-star fa-3x" />
            </FlexView>
            <div className="signUp">
              <ScrollTo>
                {scroll => (
                  <a onClick={() => scroll(0, 0)}>
                    <FlexView height={100}>
                      <FormattedText>{flexFour}</FormattedText>
                      <i class="fas fa-arrow-circle-up fa-1x" />
                    </FlexView>
                  </a>
                )}
              </ScrollTo>
            </div>
          </Zoom>
        </div>
      </div>
    );
  }

  showLoginForm = event => {
    this.setState({
      signupFormVisible: false
    });
  };

  showSignupForm = event => {
    this.setState({
      signupFormVisible: true
    });
  };

  register = event => {
    event.preventDefault();
    axios({
      method: "post",
      url: "/auth/signup",
      data: {
        username: event.target.registerUsername.value,
        password: event.target.registerPassword.value
      }
    })
      .then(res => {
        this.showLoginForm();
        console.log(res);
      })
      .catch(res => {
        console.log(res);
      });
  };

  login = event => {
    event.preventDefault();
    axios({
      method: "post",
      url: "/auth/login",
      data: {
        username: event.target.username.value,
        password: event.target.password.value
      }
    })
      .then(res => {
        window.location.reload();
        this.setState({
          user: res.data.user,
          showSignupForm: false
        });
        console.log(res);
      })
      .catch(res => {
        console.log(res);
      });
  };

  logout = () => {
    axios({
      method: "get",
      url: "/logout"
    })
      .then(() => {
        this.setState({
          user: null
        });
      })
      .catch(res => {
        console.log(res);
      });
  };
}

export default Login;
