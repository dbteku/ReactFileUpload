import React from "react";
import Axios from "axios";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      loggingIn: false,
      error: false,
      errorMessage: "",
      username: "",
      password: ""
    };
    this.login = this.login.bind(this);
    this.cancel = this.cancel.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.usernameChange = this.usernameChange.bind(this);
    this.resetError = this.resetError.bind(this);
  }

  login() {
    this.toggleLogin();

    this.setState({
      errorMessage: "",
      error: false
    });

    let loginRequest = {
      username: this.state.username,
      password: this.state.password
    };

    Axios.post("http://76.76.252.111:2525/v1/auth/login", JSON.stringify(loginRequest))
      .then(response => {
        if (response.data.SUCCESS) {
          var sessionId = response.data.session.id;
          sessionStorage.setItem("sessionId", sessionId);
          window.location = "/files";
        } else if (response.data.ERROR) {
          this.setState({
            errorMessage: response.data.MESSAGE,
            error: true,
            loggingIn: false
          });
        }
      })
      .catch(e => {
        let errorMessage = "Something went wrong... Try again later!";
        if(e.response.status === 400){
          errorMessage = e.response.data.MESSAGE
        }
        this.setState({
          errorMessage,
          error: true,
          loggingIn: false
        });
      });
  }

  toggleLogin() {
    this.setState({
      loggingIn: !this.state.loggingIn
    });
  }

  usernameChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  passwordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  resetError() {
    this.setState({
      error: false,
      errorMessage: ""
    });
  }

  cancel() {
    this.setState({
      loggingIn: false
    });
  }

  render() {
    let spinner = null;
    let loginButton = null;
    let alert = null;

    if (this.state.loggingIn) {
      spinner = (
        <div className="spinnerDark icon-spinner-2" aria-hidden="false" />
      );
      loginButton = (
        <button type="button" className="btn btn-primary disabled">
          Login
        </button>
      );
    } else {
      loginButton = (
        <button type="button" className="btn btn-primary" onClick={this.login}>
          Login
        </button>
      );
    }

    if (this.state.error) {
      alert = (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error!</strong> {this.state.errorMessage}
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={this.resetError}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }

    return (
      <div>
        <div
          className="modal fade"
          id="login"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Login
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="username"
                    className="form-control"
                    id="usernameInput"
                    aria-describedby="username"
                    placeholder="Enter username"
                    value={this.state.username}
                    onChange={this.usernameChange}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.passwordChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                {spinner}
                {loginButton}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={this.cancel}
                >
                  Cancel
                </button>
              </div>
              {alert}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
