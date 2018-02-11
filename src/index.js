import React from 'react';
import { render } from "react-dom";
import './index.css';
import App from './App';
import Nav from './components/Nav'
// import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


render(
    <Nav>
        <Router>
            <Switch>
                <Route exact path="/" render={() => <App />} />
                {/* <Route component={NotFound} status={404} /> */}
            </Switch>
        </Router>
    </Nav>,
    document.getElementById("root")
);
// registerServiceWorker();
