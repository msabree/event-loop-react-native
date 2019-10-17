import * as actionTypes from '../constants/actionTypes';

export const showSpinner = (message = '') => dispatch => {
  return dispatch({
    type: actionTypes.SHOW_SPINNER,
    payload: {
      message,
    },
  });
};

export const hideSpinner = () => dispatch => {
  return dispatch({
    type: actionTypes.HIDE_SPINNER,
  });
};
