import React from 'react';
import { render } from "react-dom";
import './index.css';
import App from './App';
import Nav from './components/Nav'
import FilePage from './pages/FilePage'
// import BackendService from './components/services/BackendService'
// import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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
                <Route exact path="/" render={() => <App changeNav={changeNav} />} />
                <Route exact path="/files" render={() => <FilePage changeNav={changeNav} />} />
                {/* <Route component={NotFound} status={404} /> */}
            </Switch>
        </Router>
    </Nav>,
    document.getElementById("root")
);
// registerServiceWorker();
