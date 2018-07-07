import React, { Component } from "react";
import FileServiceApi from "./../components/services/FileServiceApi";
import ChangeNav from "../actions/ChangeNav";
import uuid from "uuid/v1";

class FilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loggedIn: false,
      list: []
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

  componentDidMount() {
    this.setState({
      loggedIn: FileServiceApi.isLoggedIn(),
      loading: true
    });
    FileServiceApi.getFiles().then(kickback => {
      if (kickback.error) {
        if (kickback.payload.status === 401) {
          window.href = "/";
        }
      } else {
        this.setState({
          list: kickback.payload.DATA,
          loading: false
        });
      }
    });
  }

  logout() {
    FileServiceApi.logout();
    sessionStorage.setItem("sessionId", "");
    window.location = "/";
  }

  render() {
    let page = (
      <div>
        <p>Loading...</p>
      </div>
    );

    let body = (
      <tbody>
        <tr>
          <td>Loading...</td>
        </tr>
      </tbody>
    );

    const list = this.state.list.map(file => {
      return (
        <tr key={uuid()}>
          <td>{file}</td>
        </tr>
      );
    });

    if (this.state.loggedIn) {
      if (!this.state.loading) {
        body = <tbody>{list}</tbody>;
      }
      page = (
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">File Name</th>
              <th scope="col">Options</th>
            </tr>
          </thead>
          {body}
        </table>
      );
    }

    return <div className="FilePage">{page}</div>;
  }
}

export default FilePage;
