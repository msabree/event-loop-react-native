import * as actionTypes from '../constants/actionTypes';
import groupSelector from '../selectors/groups';
import formSelector from '../selectors/forms';

export const saveGroup = () => (dispatch, getState) => {
  const selectedFriendIds = groupSelector(getState()).selectedFriendIds;
  const groupIdSelected = groupSelector(getState()).groupIdSelected;
  const edittedGroupTitle = formSelector(getState()).groupTitle;

  if (groupIdSelected === '') {
    return dispatch({
      type: actionTypes.CREATE_GROUP,
      payload: {
        title: edittedGroupTitle,
        members: selectedFriendIds,
      },
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
