import React, { Component } from "react";
import FileServiceApi from "./../components/services/FileServiceApi";
import ChangeNav from "../actions/ChangeNav";
import uuid from "uuid/v1";
import qs from "qs";

class FilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loggedIn: false,
      list: [],
      fileSystem: {
        activeDirectory: "/"
      }
    };
    const fixedQuery = props.location.search.replace("?", "");
    const parsedQueryParams =  qs.parse(fixedQuery);
    if(parsedQueryParams.activeDirectory){
      this.state.fileSystem.activeDirectory = parsedQueryParams.activeDirectory;
    }
    props.history.push({
      pathname: "/files",
      search: `?${qs.stringify(this.state.fileSystem)}`
    });
    this.getFileList = this.getFileList.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleFolderOpen = this.handleFolderOpen.bind(this);
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

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.location.search === "string") {
      const fixedQuery = nextProps.location.search.replace("?", "");
      const queryParams = qs.parse(fixedQuery);
      if (
        queryParams.activeDirectory &&
        queryParams.activeDirectory !== this.state.fileSystem.activeDirectory
      ) {
        this.setState({
          fileSystem: {
            activeDirectory: queryParams.activeDirectory
          }
        },()=>{
          this.getFileList();
        });
      }
    }
  }

  componentDidMount() {
    this.setState({
      loggedIn: FileServiceApi.isLoggedIn(),
      loading: true
    });
    this.getFileList();
  }

  getFileList() {
    this.setState({
      list: [],
      loading: true,
      error: false
    });
    FileServiceApi.getFiles(this.state.fileSystem).then(kickback => {
      if (kickback.error) {
        if (kickback.payload.response.status === 401) {
          this.logout();
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

  handleDownload(file) {
    const path = this.state.fileSystem.activeDirectory + "/" + file.fileName;
    const filePath = path.replace('//', '/');
    FileServiceApi.getFile(filePath, file.fileName);
  }

  handleDelete(file) {
    this.setState({
      loading: true
    });
    if(file.isDirectory){
      alert("You cannot delete a directory!");
    }else{
      const path = this.state.fileSystem.activeDirectory + "/" + file.fileName;
      FileServiceApi.deleteFile(path.replace('//', '/')).then(() => {
        this.getFileList();
      });
    }
  }

  renderData(file) {
    let renderedData = null;
    if (file.isDirectory) {
      renderedData = this.renderFolder(file);
    } else {
      renderedData = this.renderFile(file);
    }
    return renderedData;
  }

  handleFolderOpen(file) {
    let activeDirectory =
      this.state.fileSystem.activeDirectory + "/" + file.fileName;
    if (
      this.state.fileSystem.activeDirectory.lastIndexOf("/") ===
      this.state.fileSystem.activeDirectory.length - 1
    ) {
      activeDirectory = this.state.fileSystem.activeDirectory + file.fileName;
    }
    this.setState(
      {
        fileSystem: {
          activeDirectory
        }
      },
      () => {
        this.props.history.push({
          pathname: "/files",
          search: `?${qs.stringify(this.state.fileSystem)}`
        });
        this.getFileList();
      }
    );
  }

  renderFile(file) {
    return (
      <tr key={uuid()}>
        <td style={{ display: "inline-block" }}>
          <i className="fas fa-file" />
          <div style={{ paddingLeft: "8px", display: "inline-block" }}>
            {file.fileName}
          </div>
        </td>
        <td>
          <div className="btn-group" role="group" aria-label="Basic example">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                this.handleDownload(file);
              }}
              download
            >
              Download
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                this.handleDelete(file);
              }}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  }

  renderFolder(file) {
    return (
      <tr key={uuid()}>
        <td style={{ display: "inline-block" }}>
          <i className="fas fa-folder-open" />
          <div style={{ paddingLeft: "8px", display: "inline-block" }}>
            {file.fileName}
          </div>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              this.handleFolderOpen(file);
            }}
          >
            Open
          </button>
        </td>
      </tr>
    );
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

    let list = null;

    if (this.state.list.length <= 0) {
      list = (
        <tr>
          <td>There is no data to display.</td>
        </tr>
      );
    } else {
      list = this.state.list.map(file => {
        return this.renderData(file);
      });
    }

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
