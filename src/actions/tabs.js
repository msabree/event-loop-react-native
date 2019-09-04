import * as actionTypes from '../constants/actionTypes';

export const setActiveTab = (activeIndex = 0) => (dispatch) => {
    return dispatch({
        type: actionTypes.SET_ACTIVE_TAB_INDEX,
        payload: {
            activeIndex
        }
    })
}