import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const searchReducer = createReducer(applicationState.search, {
    [actionTypes.UPDATED_SEARCH_SUGGESTIONS](state, action){
        const stateClone = cloneDeep(state);
        set(stateClone, 'suggestions', action.payload.suggestions);
        return stateClone;
    },
});