import { Toast } from 'native-base';

class Api {
    static headers() {
      return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'dataType': 'json',
      }
    }
  
    static get(route) {
      return this.xhr(route, null, 'GET');
    }
  
    static put(route, params) {
      return this.xhr(route, params, 'PUT')
    }

    static patch(route, params) {
        return this.xhr(route, params, 'PATCH')
      }
  
    static post(route, params) {
      return this.xhr(route, params, 'POST')
    }
  
    static delete(route, params) {
      return this.xhr(route, params, 'DELETE')
    }
  
    static xhr = (route, params, verb) => {
        let host = 'https://api-flaker.herokuapp.com'; // live
        if(__DEV__){
            host = 'https://dev-api-flaker.herokuapp.com'; // dev
            console.log(route)
        }
        const url = `${host}${route}`;
        let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null );
        options.headers = Api.headers()
        return fetch(url, options)
        .then( resp => {
            let json = resp.json();
            if (resp.ok) {
                return json
            }
            return json.then(err => {throw err});
        })
        .then((json) => {
            if(json.message === 'Invalid session.'){
                alert('Session has expired. Please login again.');
            }
            return json;
        })
        .catch((e) => {
            if(__DEV__){
                console.log(e);
                Toast.show({
                    text: 'We are experiencing issues with our APIs. Please try again later. Or contact us if the issue persists',
                    buttonText: 'Close',
                    type: 'warning',
                    duration: 5000,
                })
            }
            else{
                Toast.show({
                    text: 'We are experiencing issues with our APIs. Please try again later. Or contact us if the issue persists',
                    buttonText: 'Close',
                    type: 'warning',
                    duration: 5000,
                })
            }
        });
    }
  }
  export default Api