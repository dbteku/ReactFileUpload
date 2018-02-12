import React, { Component } from 'react';
// import Axios from 'axios';
import BackendService from './../components/services/BackendService'
// import { Redirect } from "react-router-dom";

class FilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        }
    }
    componentWillMount() {
        if(!this.state.loggedIn){
            this.props.changeNav([]);
        }
        BackendService.isLoggedIn().then(loggedIn => {
            if(loggedIn){
                this.props.changeNav([
                    {
                        href: "/files",
                        title: "Files",
                        active: true
                    },
                    {
                        href: "/",
                        title: "Logout",
                        active: false,
                        action: ()=>{
                            BackendService.logout();
                            sessionStorage.setItem('sessionId', '');
                            window.location = "/";
                        },
                    }
                ]);
            }
            this.setState({
                loggedIn: loggedIn
            })
        });
    }

    componentDidMount(){
    }

    logout(){
        BackendService.logout();
        sessionStorage.setItem('sessionId', '');
        window.location = "/";
    }

    render() {
        let me = this;
        let page = <div>
            <p>Loading...</p>
        </div>;

        if (this.state.loggedIn) {
            page = <div className="jumbotron">
                <h1 className="display-4">Welcome!</h1>
                <p className="lead">You are logged in!</p>
                <hr className="my-4"></hr>
                <p className="lead">
                    <a className="btn btn-primary btn-lg" data-toggle="modal" onClick={this.logout} role="button">Logout</a>
                </p>
            </div>
        } else {
            setTimeout(function(){ 
                if(!me.state.loggedIn){
                    window.location = "/";
                }
             }, 1000);
        }

        return (
            <div className="FilePage">
                {page}
            </div>
        );
    }
}

export default FilePage;
