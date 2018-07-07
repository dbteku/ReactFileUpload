import React, { Component } from "react";
import FileServiceApi from "./../components/services/FileServiceApi";
import ChangeNav from "../actions/ChangeNav";

class FilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }
  componentWillMount() {
    if (FileServiceApi.isLoggedIn()) {
      ChangeNav([
        {
          href: "/files",
          title: "Files",
          active: true
        },
        {
          href: "/",
          title: "Logout",
          active: false,
          action: () => {
            this.logout();
          }
        }
      ]);
    }
  }

  componentDidMount() {}

  logout() {
    FileServiceApi.logout();
    sessionStorage.setItem("sessionId", "");
    window.location = "/";
  }

  render() {
    let me = this;
    let page = (
      <div>
        <p>Loading...</p>
      </div>
    );

    if (this.state.loggedIn) {
      page = (
        <div className="jumbotron">
          <h1 className="display-4">Welcome!</h1>
          <p className="lead">You are logged in!</p>
          <hr className="my-4" />
          <p className="lead">
            <a
              className="btn btn-primary btn-lg"
              data-toggle="modal"
              onClick={this.logout}
              role="button"
            >
              Logout
            </a>
          </p>
        </div>
      );
    } else {
      setTimeout(function() {
        if (!me.state.loggedIn) {
          window.location = "/";
        }
      }, 1000);
    }

    return <div className="FilePage">{page}</div>;
  }
}

export default FilePage;
