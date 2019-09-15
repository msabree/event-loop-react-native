import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const friendsReducer = createReducer(applicationState.friends, {
    [actionTypes.GET_FRIENDS_LIST](state, action){
        const stateClone = cloneDeep(state);
        const current = get(action.payload.apiResponse, 'friends', []);
        const requests = get(action.payload.apiResponse, 'requests', []);
        const sentRequests = get(action.payload.apiResponse, 'sentRequests', []);
        set(stateClone, 'current', current);
        set(stateClone, 'requests', requests);
        set(stateClone, 'sentRequests', sentRequests);
        return stateClone;
    },
    [actionTypes.SET_FRIENDS_SEGMENT](state, action){
        const stateClone = cloneDeep(state);
        set(stateClone, 'activeSegment', action.payload.segment)
        return stateClone;
    },
    [actionTypes.RESPOND_TO_FRIEND_REQUEST](state, action){
        const stateClone = cloneDeep(state);
        const requestId = get(action, 'payload.requestId', '');
        const requests = get(stateClone, 'requests', []);
        const sentRequests = get(stateClone, 'sentRequests', []);
        set(stateClone, 'requests', requests.filter((req) => req.requestId !== requestId));
        set(stateClone, 'sentRequests', sentRequests.filter((req) => req.requestId !== requestId));
        return stateClone;
    },
});