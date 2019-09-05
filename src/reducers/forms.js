import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const formsReducer = createReducer(applicationState.forms, {
    [actionTypes.INPUT_CHANGE](state, action){
        const stateClone = cloneDeep(state);
        const path = get(action.payload, 'path', '');
        const value = get(action.payload, 'value', '');
        if(path !== ''){
            set(stateClone, path, value);
            return stateClone;
        }
        else{
            console.log('Path cannot be empty');
        }
    },
    [actionTypes.RESET_EVENT_FORM](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'event.startDatetime', new Date());
        set(stateClone, 'event.endDatetime', new Date());
        set(stateClone, 'event.location', null);
        set(stateClone, 'event.details', '');
        set(stateClone, 'event.title', '');
        return stateClone;
    },
    [actionTypes.RESET_APPFEEDBACK_FORM](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'appFeedback.feedback', '');
        return stateClone;
    },
})