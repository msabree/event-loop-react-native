import * as actionTypes from '../constants/actionTypes';

export const pollForSuccess = () => (dispatch) => {
    return dispatch({
        type: actionTypes.ALEXA_SYNC_POLL_FOR_SUCCESS,
    })
}

export const getVerificationCodes = () => (dispatch) => {
    return dispatch({
        type: actionTypes.ALEXA_SYNC_GET_VERIFICATION_CODES,
    })
}

export const confirmSync = (confirmed) => (dispatch) => {
    return dispatch({
        type: actionTypes.ALEXA_SYNC_CONFIRM,
        payload: {
            confirmed
        }
    })
}