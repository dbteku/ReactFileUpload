import Axios from "axios";
export default class FileServiceApi {
  static isLoggedIn() {
    const sessionId = sessionStorage.getItem("sessionId");
    return sessionId !== undefined && sessionId !== "" && sessionId !== null;
  }

  static getFiles() {
    return new Promise(resolve => {
      const sessionId = sessionStorage.getItem("sessionId");
       Axios.get("http://76.76.252.111:2525/v1/files", {
        headers: {
          "Content-Type": "application/json",
          authentication: sessionId
        }
      }).then(response=>{
        resolve({error: false, payload: response.data})
      }).catch(e=>{
        resolve({error: true, payload: e})
      });
    });
  }

  static logout() {
    const sessionId = sessionStorage.getItem("sessionId");
    return new Promise(function(resolve, reject) {
      if (sessionId === undefined || sessionId === "") {
        resolve(false);
      } else {
        Axios.post("http://76.76.252.111:2525/v1/auth/logout", {
          headers: {
            "Content-Type": "application/json",
            authentication: sessionId
          }
        })
          .then(response => {
            if (response.data.SUCCESS) {
              if (response.data.session.id === sessionId) {
                resolve(true);
              }
            }
          })
          .catch(error => {
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
