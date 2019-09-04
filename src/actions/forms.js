import * as actionTypes from '../constants/actionTypes';

export const inputChange = (path, value) => (dispatch) => {
    return dispatch({
        type: actionTypes.INPUT_CHANGE,
        payload: {
            path,
            value
        }
    })    
}