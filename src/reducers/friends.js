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
        set(stateClone, 'current', current);
        set(stateClone, 'requests', requests);
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
        set(stateClone, 'requests', requests.filter((req) => req.requestId !== requestId));
        return stateClone;
    },
    [actionTypes.SEND_FRIEND_REQUEST](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'sendFriendRequestPending', false);
        return stateClone;
    },
});