import AsyncStorage from '@react-native-community/async-storage';
import {Toast} from 'native-base';
import {Platform} from 'react-native';
import get from 'lodash/get';
import {getVersion} from 'react-native-device-info';
import * as storageKeys from '../constants/storageKeys';
import {
  INVALID_SESSION,
  API_TECHNICAL_ISSUES,
  EXPIRED_SESSION,
} from '../constants/errors';
import {
  IOS_TEST_USER_SESSION_TOKEN,
  ANDROID_TEST_USER_SESSION_TOKEN,
} from '../constants/testUsers';

class Api {
  static headers(version, sessionToken) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      dataType: 'json',
      'APP-INSTALLED-VERSION': version,
      'USER-SESSION-TOKEN': sessionToken,
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
    let sessionToken = '0'; // <- invalid session token
    try {
      sessionToken = await AsyncStorage.getItem(storageKeys.SESSION_TOKEN);
    } catch (e) {}

    if (__DEV__) {
      if (Platform.OS === 'ios') {
        sessionToken = IOS_TEST_USER_SESSION_TOKEN;
      } else {
        sessionToken = ANDROID_TEST_USER_SESSION_TOKEN;
      }
    }

    const url = `${host}${route}`;
    let options = Object.assign(
      {method: verb},
      params ? {body: JSON.stringify(params)} : null,
    );
    const version = await getVersion();
    options.headers = Api.headers(version, sessionToken);
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
        if (get(json, 'message', '').toLowerCase() === INVALID_SESSION) {
          Toast.show({
            text: EXPIRED_SESSION,
            buttonText: 'Close',
            type: 'danger',
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
            type: 'danger',
            duration: 5000,
          });
        } else {
          Toast.show({
            text: API_TECHNICAL_ISSUES,
            buttonText: 'Close',
            type: 'danger',
            duration: 5000,
          });
        }
      });
  };
}
export default Api;
