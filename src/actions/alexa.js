import get from 'lodash/get';
import * as actionTypes from '../constants/actionTypes';
import authenticationSelector from '../selectors/authentication';
import api from '../utils/api';

export const checkAlexaSync = () => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.get(`/alexa/sync-code/${sessionToken}`)
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        // use api message
        if(apiResponse.success === false){
            console.log(apiResponse)
        }
        else if(apiResponse.paired === true){
            return dispatch({
                type: actionTypes.ALEXA_SYNC_CONFIRM,
            })
        }
        else{
            console.log('Keep polling...')
        }
    })
    .catch((err) => {
        console.log(err);
    })
}

export const inititateAlexaSync = () => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.post(`/alexa/sync-code/${sessionToken}`, {})
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        // use api message
        if(apiResponse.success === false){
            alert('Unable to generate a new sync code. Please try again later.')
        }
        else{
            return dispatch({
                type: actionTypes.ALEXA_SYNC_CODE,
                payload: {
                    syncCode: apiResponse.syncCode
                }
            })
        }
    })
    .catch((err) => {
        console.log(err);
    })
}

export const confirmSyncRequest = () => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.delete(`/alexa/sync-code/${sessionToken}`, {})
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        // use api message
        if(apiResponse.success === false){
            alert('Unable to complete sync process. Please try again later.')
        }
        else{
            return dispatch({
                type: actionTypes.ALEXA_CONNECTED,
            })
        }
    })
    .catch((err) => {
        console.log(err);
    })
}