import { Toast } from 'native-base';
import get from 'lodash/get';

import * as actionTypes from '../constants/actionTypes';
import api from '../utils/api';
import authenticationSelector from '../selectors/authentication';

export const getFriendsListProfileActivity = () => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.get(`/profile/friends/${sessionToken}`)
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }
        return dispatch({
            type: actionTypes.GET_FRIENDS_LIST_PROFILE_ACTIVITY,
            payload: {
                apiResponse,
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })
}

export const getFriendsList = () => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.get(`/friends/${sessionToken}`)
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }
        return dispatch({
            type: actionTypes.GET_FRIENDS_LIST,
            payload: {
                apiResponse,
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })
}

export const setFriendsActiveSegment = (segment = 'current') => (dispatch) => {
    return dispatch({
        type: actionTypes.SET_FRIENDS_SEGMENT,
        payload: {
            segment
        }
    })
}

export const sendFriendRequest = (friendUserId) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.post(`/friends/request`, {
        sessionToken,
        friendUserId
    })
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        if(apiResponse.success === true){
            Toast.show({
                text: 'Sent friend request.',
                buttonText: 'Close',
                type: 'success',
                duration: 3000,
            })
        }
        else if(apiResponse.message === 'friends') {
            Toast.show({
                text: 'You are already friends with this user.',
                buttonText: 'Close',
                type: 'warning',
                duration: 4000,
            })
        }
        else if(apiResponse.message === 'requested') {
            Toast.show({
                text: 'You already requested this user as a friend.',
                buttonText: 'Close',
                type: 'warning',
                duration: 4000,
            })
        }

        // GET NEW FRIENDS LIST
        dispatch(getFriendsList())

        // CLEAR SEARCH DROPDOWN
        return dispatch({
            type: actionTypes.UPDATED_SEARCH_SUGGESTIONS,
            payload: {
                suggestions: [],
            }
        })
    })
    .catch((err) => {
        console.log(err);
    });
}

export const resetFriendSearch = () => (dispatch) => {
    return dispatch({
        type: actionTypes.CLEAR_SEARCH_CONFIRMATION,
    })
}

export const respondToRequest = (requestId, isConfirmed = false) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.post(`/friends/request-response`, {
        sessionToken,
        requestId,
        isConfirmed,
    })
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        dispatch(getFriendsList())

        return dispatch({
            type: actionTypes.RESPOND_TO_FRIEND_REQUEST,
            payload: {
                apiResponse,
                requestId,
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })
}

export const removeFriend = (friendUserId) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.delete(`/friends/${sessionToken}/${friendUserId}`)
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }
        return dispatch(getFriendsList())
    })
    .catch((err) => {
        console.log(err);
    })
}