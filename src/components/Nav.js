import React from 'react'
import Login from './Login'

export default class Nav extends React.Component {

    render() {
        return (
            <div className="Nav">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="/">React File Manager</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/files">Files</a>
                            </li>
                            <li className="nav-item">
                                <a  className="nav-link" data-toggle="modal" href="#login">Login</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Login/>
                {this.props.children}
            </div>
        );
    }

}