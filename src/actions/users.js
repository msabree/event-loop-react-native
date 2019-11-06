import get from 'lodash/get';

import * as actionTypes from '../constants/actionTypes';
import api from '../utils/api';
import authenticationSelector from '../selectors/authentication';
import usersSelector from '../selectors/users';
import formsSelector from '../selectors/forms';
import friendsSelector from '../selectors/friends';

const USERNAME_REGEX = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/im);

export const updateUserInfo = (updateObject, verifyUsername = false) => (
  dispatch,
  getState,
) => {
  const authenticationState = authenticationSelector(getState());
  const usersState = usersSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');
  const username = get(updateObject, 'username', '').toLowerCase();
  const loggedInUsername = get(usersState, 'loggedInUsername', '');

  if (username === '' && verifyUsername === true) {
    alert('Username can not be empty.');
    return;
  }

  Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        if (username !== '' && username !== loggedInUsername) {
          // check if valid regex for username here
          const isValid = USERNAME_REGEX.test(username);
          if (isValid) {
            // Check new username availability
            api
              .get(`/users/search/${sessionToken}/${username}`)
              .then(apiResponse => {
                if (
                  get(apiResponse, 'message', '').toLowerCase() ===
                  'invalid session.'
                ) {
                  return dispatch({
                    type: actionTypes.INVALID_SESSION,
                  });
                } else if (apiResponse.user === null) {
                  resolve();
                } else {
                  alert('Username not available');
                  reject('Username not available');
                }
              });
          } else {
            alert(
              'Invalid username. Please use letters, numbers, underscores, and/or periods.',
            );
            reject('Username not available');
          }
        } else {
          resolve();
        }
      });
    })
    .then(() => {
      dispatch({
        type: actionTypes.CLOSE_EDIT_USER_INFO_MODAL,
      });
      return api.put(`/users/${sessionToken}`, updateObject);
    })
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      } else if (apiResponse.success === false) {
        alert('Unable to save changes.');
      } else {
        return dispatch(getLoggedInUserInfo());
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const getLoggedInUserInfo = () => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  if (sessionToken !== null && sessionToken !== '') {
    api
      .get(`/users/${sessionToken}`)
      .then(apiResponse => {
        if (
          get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
        ) {
          return dispatch({
            type: actionTypes.INVALID_SESSION,
          });
        }
        return dispatch({
          type: actionTypes.GET_LOGGED_IN_USER_INFO,
          payload: {
            apiResponse,
          },
        });
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    console.log('No valid session.');
  }
};

export const openEditUserInfoModal = () => dispatch => {
  return dispatch({
    type: actionTypes.OPEN_EDIT_USER_INFO_MODAL,
  });
};

export const closeEditUserInfoModal = () => dispatch => {
  return dispatch({
    type: actionTypes.CLOSE_EDIT_USER_INFO_MODAL,
  });
};

export const changedUsernameText = username => dispatch => {
  return dispatch({
    type: actionTypes.CHANGED_USERNAME_TEXT,
    payload: {
      username,
    },
  });
};

export const changedDisplayNameText = displayName => dispatch => {
  return dispatch({
    type: actionTypes.CHANGED_DISPLAY_NAME_TEXT,
    payload: {
      displayName,
    },
  });
};

export const sendAppFeedback = () => (dispatch, getState) => {
  const {feedback = ''} = get(formsSelector(getState()), 'appFeedback', {});
  const sessionToken = get(
    authenticationSelector(getState()),
    'sessionToken',
    '',
  );
  if (feedback.trim() !== '') {
    api
      .post('/users/app-feedback', {
        sessionToken,
        feedback,
      }) // not really a users route but meh...
      .then(apiResponse => {
        if (
          get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
        ) {
          return dispatch({
            type: actionTypes.INVALID_SESSION,
          });
        }
        alert('Thanks for helping make our app better!');
        return dispatch({
          type: actionTypes.RESET_APPFEEDBACK_FORM,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
