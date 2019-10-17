import {Toast} from 'native-base';
import {getVersion} from 'react-native-device-info';

class Api {
  static headers(version) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      dataType: 'json',
      'APP-INSTALLED-VERSION': version,
    };
  }

  static get(route) {
    return this.xhr(route, null, 'GET');
  }

  static put(route, params) {
    return this.xhr(route, params, 'PUT');
  }

  static patch(route, params) {
    return this.xhr(route, params, 'PATCH');
  }

  static post(route, params) {
    return this.xhr(route, params, 'POST');
  }

  static delete(route, params) {
    return this.xhr(route, params, 'DELETE');
  }

  static xhr = async (route, params, verb) => {
    let host = 'https://api-flaker.herokuapp.com'; // live
    if (__DEV__) {
      host = 'https://dev-api-flaker.herokuapp.com'; // dev
      console.log(route);
    }
    const url = `${host}${route}`;
    let options = Object.assign(
      {method: verb},
      params ? {body: JSON.stringify(params)} : null,
    );
    const version = await getVersion();
    options.headers = Api.headers(version);
    return fetch(url, options)
      .then(resp => {
        let json = resp.json();
        if (resp.ok) {
          return json;
        }
        return json.then(err => {
          throw err;
        });
      })
      .then(json => {
        if (json.message === 'Invalid session.') {
          Toast.show({
            text: 'Session has expired. Please login again.',
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
          });
        }
        return json;
      })
      .catch(e => {
        if (__DEV__) {
          Toast.show({
            text: e.message,
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
          });
        } else {
          Toast.show({
            text:
              'We are experiencing issues with our APIs. Please try again later. Or contact us if the issue persists.',
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
          });
        }
      });
  };
}
export default Api;
