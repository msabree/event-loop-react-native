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

export const setManageGroupModalVisible = (
  id = '',
  isVisible = false,
) => dispatch => {
  return dispatch({
    type: actionTypes.SET_MANAGE_GROUP_MODAL_VISIBLE,
    payload: {
      id,
      isVisible,
    },
  });
};
