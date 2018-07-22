import Axios from "axios";
import qs from 'qs';

export default class FileServiceApi {
  static isLoggedIn() {
    const sessionId = sessionStorage.getItem("sessionId");
    return sessionId !== undefined && sessionId !== "" && sessionId !== null;
  }

  static getFiles(activeDirectory) {
    return new Promise(resolve => {
      const sessionId = sessionStorage.getItem("sessionId");
      console.log("http://localhost/v1/files?" + qs.stringify(activeDirectory));
      Axios.get("http://localhost/v1/files?" + qs.stringify(activeDirectory), {
        headers: {
          "Content-Type": "application/json",
          authentication: sessionId
        }
      })
        .then(response => {
          resolve({ error: false, payload: response.data });
        })
        .catch(e => {
          resolve({ error: true, payload: e });
        });
    });
  }

  static getFile(filePath, fileName){
    Axios({
      url: `http://localhost/v1/files/download?location=${filePath}`,
      method: 'GET',
      headers: {authentication: sessionStorage.getItem('sessionId')},
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
  }

  static deleteFile(fileName) {
    const sessionId = sessionStorage.getItem("sessionId");
    return new Promise(resolve => {
      Axios.delete(`http://localhost/v1/files?location=${fileName}`, {
        headers: {
          "Content-Type": "application/json",
          authentication: sessionId
        }
      }).then(response=>{
        resolve({error: false, payload: response.data});
      }).catch(e =>{
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
        Axios.post("http://localhost/v1/auth/logout", {
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
