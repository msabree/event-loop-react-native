import {Toast} from 'native-base';
import get from 'lodash/get';
import * as actionTypes from '../constants/actionTypes';
import authenticationSelector from '../selectors/authentication';
import api from '../utils/api';

export const checkAlexaSync = () => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .get(`/alexa/sync-code/${sessionToken}`)
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      // use api message
      if (apiResponse.paired === true) {
        return dispatch({
          type: actionTypes.ALEXA_SYNC_CONFIRM,
        });
      }

      if (__DEV__) {
        console.log(apiResponse);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const inititateAlexaSync = () => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .post(`/alexa/sync-code/${sessionToken}`, {})
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      // use api message
      if (apiResponse.success === false) {
        Toast.show({
          text: 'Unable to generate a new sync code. Please try again later.',
          buttonText: 'Close',
          type: 'warning',
          duration: 3000,
        });
      } else {
        return dispatch({
          type: actionTypes.ALEXA_SYNC_CODE,
          payload: {
            syncCode: apiResponse.syncCode,
          },
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const confirmSyncRequest = () => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .delete(`/alexa/sync-code/${sessionToken}`, {})
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      // use api message
      if (apiResponse.success === false) {
        Toast.show({
          text: 'Unable to complete sync process. Please try again later.',
          buttonText: 'Close',
          type: 'warning',
          duration: 3000,
        });
      } else {
        Toast.show({
          text: 'Your alexa device is now connected!',
          buttonText: 'Close',
          type: 'success',
          duration: 3000,
        });

        return dispatch({
          type: actionTypes.ALEXA_CONNECTED,
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};
export const deleteAlexaConnection = () => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .delete(`/alexa/connection/${sessionToken}`)
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      // use api message
      if (apiResponse.success === false) {
        Toast.show({
          text: 'Unable to delete the connection. Please try again later.',
          buttonText: 'Close',
          type: 'warning',
          duration: 3000,
        });
      } else {
        Toast.show({
          text: 'Your alexa device is no longer connected!',
          buttonText: 'Close',
          type: 'warning',
          duration: 3000,
        });

        return dispatch({
          type: actionTypes.ALEXA_DISCONNECTED,
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};
