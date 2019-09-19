import get from 'lodash/get';

import * as actionTypes from '../constants/actionTypes';
import authenticationSelector from '../selectors/authentication';
import api from '../utils/api';

export const getComments = () => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.get(`/groups/${sessionToken}`)
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        return dispatch({
            type: actionTypes.GET_GROUPS,
            payload: {
                apiResponse
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })   
}

export const postComment = (eventId, comment = '') => (dispatch, getState) => {
    if(comment.trim !== ''){
        console.log(eventId, comment)
    }
}

export const removeComment = () => (dispatch, getState) => {}
