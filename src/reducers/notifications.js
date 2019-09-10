import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const notificationsReducer = createReducer(applicationState.notifications, {
    [actionTypes.FETCHING_NOTIFICATIONS](state, action){
        const stateClone = cloneDeep(state);
        set(stateClone, 'refreshing', true);
        return stateClone;
    },
    [actionTypes.GET_NOTIFICATIONS](state, action){
        const stateClone = cloneDeep(state);
        const notificationList = get(action.payload.apiResponse, 'notifications', []);
        set(stateClone, 'list', notificationList);
        set(stateClone, 'refreshing', false);
        set(stateClone, 'badgeCount', notificationList.filter((item) => item.viewed === false).length);
        return stateClone;
    },
});