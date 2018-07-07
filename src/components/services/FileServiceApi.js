import Axios from 'axios';
export default class FileServiceApi {

    static isLoggedIn() {
        const sessionId = sessionStorage.getItem('sessionId');
        return sessionId !== undefined && sessionId !== "" && sessionId !== null;
    }

    static logout(){
        return new Promise(function (resolve, reject) {
            const sessionId = sessionStorage.getItem('sessionId');
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