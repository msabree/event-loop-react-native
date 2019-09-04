import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const eventsReducer = createReducer(applicationState.events, {
    [actionTypes.GET_EVENTS](state, action){
        const stateClone = cloneDeep(state);
        const eventsList = get(action.payload.apiResponse, 'events', []);
        set(stateClone, 'list', eventsList);
        return stateClone;
    },
    [actionTypes.GET_EVENT_GUEST_LIST](state, action){
        const stateClone = cloneDeep(state);
        const eventGuestList = get(action.payload.apiResponse, 'guestList', []);
        set(stateClone, 'guestList', eventGuestList);
        return stateClone;
    },
    [actionTypes.CLEAR_EVENT_GUEST_LIST](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'guestList', []);
        return stateClone;
    },
});