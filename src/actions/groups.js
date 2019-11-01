// import {Toast} from 'native-base';
import * as actionTypes from '../constants/actionTypes';

export const createGroup = (title, members) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.CREATE_GROUP,
    payload: {
      title,
      members,
    },
  });
};
export const editGroup = (members, id) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.EDIT_GROUP,
    payload: {
      members,
      id,
    },
  });
};
