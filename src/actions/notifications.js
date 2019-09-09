import get from 'lodash/get';
import * as actionTypes from '../constants/actionTypes';
import authenticationSelector from '../selectors/authentication';
import api from '../utils/api';

export const getNotifications = () => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

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