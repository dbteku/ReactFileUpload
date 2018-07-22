import React from "react";
import Login from "./Login";
import { lookup } from "@boostbank/stateful/lib/substore";
import { connectTo, disconnectFrom } from "@boostbank/react-stateful";

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.props.linkNav(navLinks => {
      this.changeNav(navLinks);
    });
    this.state = {
      navLinks: [
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
      ]
    };
    this.changeNav = this.changeNav.bind(this);
  }

  changeNav(navLinks) {
    this.setState({
      navLinks: navLinks
    });
  }

  componentWillMount() {
    connectTo(this, lookup().nav, state => {
      this.setState({
        navLinks: state.links
      });
    });
  }

  componentWillUnmount() {
    disconnectFrom(this, lookup().nav);
  }

  render() {
    let navBar = null;

    if (this.state.navLinks.length > 0) {
      navBar = this.state.navLinks.map(function(navLink) {
        let newLink = null;
        if (navLink.active) {
          newLink = (
            <li key={navLink.title} className="nav-item active">
              <a className="nav-link" href={navLink.href}>
                {navLink.title} <span className="sr-only">(current)</span>
              </a>
            </li>
          );
        } else {
          if (navLink.data) {
            if (navLink.data.dataToggle) {
              newLink = (
                <li key={navLink.title} className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle={navLink.data.toggle}
                    href={navLink.href}
                  >
                    {navLink.title}
                  </a>
                </li>
              );
            }
          } else if (navLink.action) {
            newLink = (
              <li key={navLink.title} className="nav-item">
                <a
                  className="nav-link"
                  onClick={navLink.action}
                  href={navLink.href}
                >
                  {navLink.title}
                </a>
              </li>
            );
          } else {
            newLink = (
              <li key={navLink.title} className="nav-item">
                <a className="nav-link" href={navLink.href}>
                  {navLink.title}
                </a>
              </li>
            );
          }
        }
        return newLink;
      });
    }

    return (
      <div className="Nav">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="/">
            React File Manager
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">{navBar}</ul>
          </div>
        </nav>
        <Login />
        {this.props.children}
      </div>
    );
  }
}
