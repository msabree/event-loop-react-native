// import {Toast} from 'native-base';
import get from 'lodash/get';
import * as actionTypes from '../constants/actionTypes';
import authenticationSelector from '../selectors/authentication';
import api from '../utils/api';

export const likeDeal = id => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.LIKE_DEAL,
    payload: {
      id,
    },
  });
};
