import Axios from 'axios';
export default class BackendService {

    static isLoggedIn() {
        return new Promise(function (resolve, reject) {
            var sessionId = sessionStorage.getItem('sessionId');
            if (sessionId === undefined || sessionId === "") {
                resolve(false);
            } else {
                Axios.get("http://localhost/v1/auth/loggedIn", {
                    headers: {
                        "Content-Type": "application/json",
                        "authentication": sessionId
                    }
                }).then(response => {
                    if (response.data.SUCCESS) {
                        if (response.data.session.id === sessionId) {
                            resolve(true);
                        }
                    }
                }).catch(error => {
                    if (error.response.data.ERROR) {
                        if (error.response.status === 401) {
                            resolve(false);
                        }
                    }
                });
            }
        });
    }

    static logout(){
        return new Promise(function (resolve, reject) {
            var sessionId = sessionStorage.getItem('sessionId');
            if (sessionId === undefined || sessionId === "") {
                resolve(false);
            } else {
                Axios.post("http://localhost/v1/auth/logout", {
                    headers: {
                        "Content-Type": "application/json",
                        "authentication": sessionId
                    }
                }).then(response => {
                    if (response.data.SUCCESS) {
                        if (response.data.session.id === sessionId) {
                            resolve(true);
                        }
                    }
                }).catch(error => {
                    if (error.response.data.ERROR) {
                        if (error.response.status === 401) {
                            resolve(false);
                        }
                    }
                });
            }
        });
    }

}