import React from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import Nav from "./components/Nav";
import FilePage from "./pages/FilePage";
// import registerServiceWorker from './registerServiceWorker';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import FileServiceApi from "./components/services/FileServiceApi";
import SubStores from "./stateful/SubStores";

SubStores();

let navCallback = undefined;

function linkNav(callback) {
  navCallback = callback;
}

function changeNav(navLinks) {
  navCallback(navLinks);
}

render(
  <Nav linkNav={linkNav}>
    <Router>
      <Switch>
        <Route exact path="/" render={props => <App {...props} changeNav={changeNav} />} />
        <Route
          exact
          path="/files"
          render={props => {
            let component = <Redirect to="/" />;
            if (FileServiceApi.isLoggedIn()) {
              component = <FilePage {...props} />;
            }
            return component;
          }}
        />
        {/* <Route component={NotFound} status={404} /> */}
      </Switch>
    </Router>
  </Nav>,
  document.getElementById("root")
);
// registerServiceWorker();
