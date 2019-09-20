import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const eventsReducer = createReducer(applicationState.events, {
    [actionTypes.FETCHING_EVENTS](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'fetchingNew', true);
        return stateClone;
    },
    [actionTypes.GET_EVENTS](state, action){
        const stateClone = cloneDeep(state);
        const eventsFilter = get(stateClone, 'filter', 'upcoming');
        const userId = get(action.payload, 'loggedInUserId', '')
        const eventsList = get(action.payload.apiResponse, 'events', []).filter((event) => {
            if(eventsFilter === 'upcoming'){
                return new Date(event.endDatetime) >= new Date();
            }
            else if(eventsFilter === 'past'){
                return new Date(event.endDatetime) < new Date();
            }
            else if(eventsFilter === 'created') {
                return event.userId === userId;
            }
            else if(eventsFilter === 'joined') {
                return get(event, 'guestList', []).indexOf(userId) !== -1;
            }
            else{
                console.log('how sway')
                return true;
            }
        })
        set(stateClone, 'created', false);
        set(stateClone, 'list', eventsList);
        set(stateClone, 'fetchingNew', false);
        return stateClone;
    },
    [actionTypes.GET_EVENT_GUEST_LIST](state, action){
        const stateClone = cloneDeep(state);
        const eventGuestList = get(action.payload.apiResponse, 'guestList', []);
        set(stateClone, 'guestList', eventGuestList);
        return stateClone;
    },
    [actionTypes.GET_EVENT_COMMENTS](state, action){
        const comments = get(action.payload.apiResponse, 'comments', []);
        const stateClone = cloneDeep(state);
        set(stateClone, 'comments', comments);
        return stateClone;
    },
    [actionTypes.CLEAR_EVENT_GUEST_LIST](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'guestList', []);
        return stateClone;
    },
    [actionTypes.CHANGE_EVENTS_FILTER](state, action){
        const stateClone = cloneDeep(state);
        set(stateClone, 'filter', action.payload.filter);
        return stateClone;
    },
    [actionTypes.NEW_EVENT_CREATED](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'created', true);
        return stateClone;
    },
});