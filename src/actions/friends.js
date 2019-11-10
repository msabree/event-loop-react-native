import {Toast} from 'native-base';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';

import * as actionTypes from '../constants/actionTypes';
import api from '../utils/api';
import authenticationSelector from '../selectors/authentication';
import friendsSelector from '../selectors/friends';

export const getFriendsListProfileActivity = () => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .get(`/profile/friends/${sessionToken}`)
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }
      return dispatch({
        type: actionTypes.GET_FRIENDS_LIST_PROFILE_ACTIVITY,
        payload: {
          apiResponse,
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getFriendsList = () => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .get(`/friends/${sessionToken}`)
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }
      return dispatch({
        type: actionTypes.GET_FRIENDS_LIST,
        payload: {
          apiResponse,
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const setFriendsActiveSegment = (segment = 'current') => dispatch => {
  return dispatch({
    type: actionTypes.SET_FRIENDS_SEGMENT,
    payload: {
      segment,
    },
  });
};

export const sendFriendRequest = friendUserId => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .post('/friends/request', {
      sessionToken,
      friendUserId,
    })
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      if (apiResponse.success === true) {
        Toast.show({
          text: 'Sent friend request.',
          buttonText: 'Close',
          type: 'success',
          duration: 3000,
        });
      } else if (apiResponse.message === 'friends') {
        Toast.show({
          text: 'You are already friends with this user.',
          buttonText: 'Close',
          type: 'danger',
          duration: 4000,
        });
      } else if (apiResponse.message === 'requested') {
        Toast.show({
          text:
            'User request pending. Check sent and incoming friend requests.',
          buttonText: 'Close',
          type: 'danger',
          duration: 4000,
        });
      }

      // GET NEW FRIENDS LIST
      dispatch(getFriendsList());

      // CLEAR SEARCH DROPDOWN
      return dispatch({
        type: actionTypes.UPDATED_SEARCH_SUGGESTIONS,
        payload: {
          suggestions: [],
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const resetFriendSearch = () => dispatch => {
  return dispatch({
    type: actionTypes.CLEAR_SEARCH_CONFIRMATION,
  });
};

export const respondToRequest = (userId, isConfirmed = false) => (
  dispatch,
  getState,
) => {
  const friendsState = friendsSelector(getState());
  const sentRequests = get(friendsState, 'sentRequests', []).filter(
    request => request.userId === userId,
  );
  const requests = get(friendsState, 'requests', []).filter(
    request => request.requestorUserId === userId,
  );

  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');
  const requestId =
    sentRequests.length > 0 ? sentRequests[0].requestId : requests[0].requestId;

  api
    .post('/friends/request-response', {
      sessionToken,
      requestId,
      isConfirmed,
    })
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      dispatch(getFriendsList());

      if (isConfirmed) {
        Toast.show({
          text: 'Request has been confirmed.',
          buttonText: 'Close',
          type: 'success',
          duration: 3000,
        });
      } else {
        Toast.show({
          text: 'Request has been deleted.',
          buttonText: 'Close',
          type: 'danger',
          duration: 3000,
        });
      }

      return dispatch({
        type: actionTypes.RESPOND_TO_FRIEND_REQUEST,
        payload: {
          apiResponse,
          requestId,
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const removeFriend = friendUserId => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .delete(`/friends/${sessionToken}/${friendUserId}`)
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }
      return dispatch(getFriendsList());
    })
    .catch(err => {
      console.log(err);
    });
};

// friendStatus -> current, incomingRequest, outgoingRequest, or none
export const showProfilePreviewModal = (
  profile,
  isExistingFriend = false,
) => async (dispatch, getState) => {
  const friendsState = friendsSelector(getState());
  const currentFriends = get(friendsState, 'current', []);
  const sentRequests = get(friendsState, 'sentRequests', []);
  const requests = get(friendsState, 'requests', []);

  let friendStatus = 'current';
  if (isExistingFriend === false) {
    if (
      findIndex(currentFriends, item => {
        return item.friendUserId === profile.userId;
      }) !== -1
    ) {
      friendStatus = 'current';
    } else if (
      findIndex(sentRequests, item => {
        return item.userId === profile.userId;
      }) !== -1
    ) {
      friendStatus = 'outgoingRequest';
    } else if (
      findIndex(requests, item => {
        return item.requestorUserId === profile.userId;
      }) !== -1
    ) {
      friendStatus = 'incomingRequest';
    } else {
      friendStatus = 'none';
    }
  }

  if (friendStatus !== undefined) {
    return dispatch({
      type: actionTypes.SHOW_PROFILE_PREVIEW_MODAL,
      payload: {
        profile,
        friendStatus,
      },
    });
  } else {
    console.log(profile.userId);
  }
};

export const closeProfilePreviewModal = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.CLOSE_PROFILE_PREVIEW_MODAL,
  });
};

export const updateStarred = (starred = true, friendUserId) => (
  dispatch,
  getState,
) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .put(`/friends/${sessionToken}`, {
      starred,
      friendUserId,
    })
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }
      return dispatch(getFriendsList());
    })
    .catch(err => {
      console.log(err);
    });
};
