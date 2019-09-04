import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const tabsReducer = createReducer(applicationState.tabs, {
    [actionTypes.SET_ACTIVE_TAB_INDEX](state, action){
        const stateClone = cloneDeep(state);
        set(stateClone, 'activeIndex', action.payload.activeIndex);
        return stateClone;
    },
});