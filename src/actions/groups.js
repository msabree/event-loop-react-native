import get from 'lodash/get';
import api from '../utils/api';
import * as actionTypes from '../constants/actionTypes';
import groupSelector from '../selectors/groups';
import formSelector from '../selectors/forms';
import {INVALID_SESSION} from '../constants/errors';

export const getGroups = () => dispatch => {
  api
    .get('/groups')
    .then(apiResponse => {
      if (get(apiResponse, 'message', '').toLowerCase() === INVALID_SESSION) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      } else {
        console.log(apiResponse);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const saveGroup = () => (dispatch, getState) => {
  const selectedFriendIds = groupSelector(getState()).selectedFriendIds;
  const groupIdSelected = groupSelector(getState()).groupIdSelected;
  const edittedGroupTitle = formSelector(getState()).groupTitle;

  if (groupIdSelected === '') {
    api
      .post('/groups', {
        members: selectedFriendIds,
        title: edittedGroupTitle,
      })
      .then(apiResponse => {
        if (get(apiResponse, 'message', '').toLowerCase() === INVALID_SESSION) {
          return dispatch({
            type: actionTypes.INVALID_SESSION,
          });
        } else {
          // get groups? or save a call?
          return dispatch({
            type: actionTypes.CREATE_GROUP,
            payload: {
              title: edittedGroupTitle,
              members: selectedFriendIds,
            },
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  return dispatch({
    type: actionTypes.SAVE_GROUP,
    payload: {
      members: selectedFriendIds,
      id: groupIdSelected,
      title: edittedGroupTitle,
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

export const setSelectedFriendIds = (selectedFriendIds = []) => dispatch => {
  return dispatch({
    type: actionTypes.SET_SELECTED_FRIEND_IDS,
    payload: {
      selectedFriendIds,
    },
  });
};
