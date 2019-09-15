import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const searchReducer = createReducer(applicationState.search, {
    [actionTypes.UPDATED_SEARCH_SUGGESTIONS](state, action){
        const stateClone = cloneDeep(state);
        const suggestions = get(action.payload, 'suggestions', []);
        set(stateClone, 'suggestions', suggestions.slice(0, 5));
        return stateClone;
    },
});