import get from 'lodash/get';

import * as actionTypes from '../constants/actionTypes';
import authenticationSelector from '../selectors/authentication';
import notificationsSelector from '../selectors/notifications';
import api from '../utils/api';

export const getNotifications = (dispatchFetching = false) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    if(dispatchFetching){
        dispatch({
            type: actionTypes.FETCHING_NOTIFICATIONS,
        })
    }

    api.get(`/notifications/${sessionToken}`)
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        return dispatch({
            type: actionTypes.GET_NOTIFICATIONS,
            payload: {
                apiResponse
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })   
}

export const markNotificationsRead = () => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    const notificationsState = notificationsSelector(getState());
    const notificationIdsUnread = get(notificationsState, 'list', []).filter((notification) => {
        return notification.read === false;
    }).map((notification) => {
        return notification._id;
    });

    api.put(`/notifications/${sessionToken}`, {
        notificationIds: notificationIdsUnread,
    })
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        return dispatch(getNotifications())
    })
    .catch((err) => {
        console.log(err);
    })   
}