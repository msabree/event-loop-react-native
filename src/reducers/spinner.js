import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const spinnerReducer = createReducer(applicationState.spinner, {
    [actionTypes.SHOW_SPINNER](state, action){
        const stateClone = cloneDeep(state);
        set(stateClone, 'visible', true);
        set(stateClone, 'message', action.payload.message);
        return stateClone;
    },
    [actionTypes.HIDE_SPINNER](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'visible', false);
        set(stateClone, 'message', '');
        return stateClone;
    },
})