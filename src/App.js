import React, { Component } from "react";
import "./App.css";
import FileServiceApi from "./components/services/FileServiceApi";
import ChangeNav from "./actions/ChangeNav";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: (
        <div>
          <p>Loading...</p>
        </div>
      ),
      loggedIn: false
    };
    props.changeNav(this.state.navLinks);
  }

  componentWillMount() {
    const loggedIn = FileServiceApi.isLoggedIn();
    if (!loggedIn) {
      ChangeNav([
        {
          href: "/",
          title: "Home",
          active: true
        },
        {
          href: "#login",
          title: "Login",
          active: false,
          data: {
            dataToggle: true,
            toggle: "modal"
          }
        }
      ]);
    }
    this.setState({
      loggedIn
    });
  }

  render() {
    if (!this.state.loggedIn) {
      setTimeout(
        function() {
          if (!this.state.loggedIn) {
            this.setState({
              page: (
                <div className="jumbotron">
                  <h1 className="display-4">Welcome!</h1>
                  <p className="lead">Login to manage your files </p>
                  <hr className="my-4" />
                  <p className="lead">
                    <a
                      className="btn btn-primary btn-lg"
                      data-toggle="modal"
                      href="#login"
                      role="button"
                    >
                      Login
                    </a>
                  </p>
                </div>
              )
            });
          }
        }.bind(this),
        1000
      );
    } else {
      window.location = "/files";
    }

    return <div className="App">{this.state.page}</div>;
  }
}

export default App;
