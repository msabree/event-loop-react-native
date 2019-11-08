import {Toast} from 'native-base';
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
        return dispatch({
          type: actionTypes.GET_GROUPS,
          payload: {
            groups: apiResponse.groups,
          },
        });
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
    if (edittedGroupTitle.trim() === '') {
      Toast.show({
        text: 'Group name cannot be empty.',
        buttonText: 'Close',
        type: 'warning',
        duration: 3000,
      });
    } else {
      api
        .post('/groups', {
          members: selectedFriendIds,
          title: edittedGroupTitle,
        })
        .then(apiResponse => {
          if (
            get(apiResponse, 'message', '').toLowerCase() === INVALID_SESSION
          ) {
            return dispatch({
              type: actionTypes.INVALID_SESSION,
            });
          } else {
            return dispatch(getGroups());
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  return dispatch({
    type: actionTypes.UPDATE_GROUP,
    payload: {
      members: selectedFriendIds,
      groupId: groupIdSelected,
      title: edittedGroupTitle,
    },
  });
};

export const setManageGroupModalVisible = (
  groupId = '',
  isVisible = false,
) => dispatch => {
  return dispatch({
    type: actionTypes.SET_MANAGE_GROUP_MODAL_VISIBLE,
    payload: {
      groupId,
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
