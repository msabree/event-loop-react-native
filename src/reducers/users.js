import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const usersReducer = createReducer(applicationState.users , {
    [actionTypes.GET_LOGGED_IN_USER_INFO](state, action){
        const stateClone = cloneDeep(state);
        const apiResponse = get(action.payload, 'apiResponse', {});
        const username = get(apiResponse, 'profile.username', '');
        const displayName = get(apiResponse, 'profile.displayName', '');
        const userId = get(apiResponse, 'profile.userId', '');
        const profilePic = get(apiResponse, 'profile.profilePic', 'https://flaker-images.s3.amazonaws.com/default-profile.png');
        const alexaSessionTokenActive = get(apiResponse, 'profile.alexaSessionTokenActive', false);

        set(stateClone, 'loggedIn.username', username);
        set(stateClone, 'loggedIn.profilePic', profilePic);
        set(stateClone, 'loggedIn.userId', userId);
        set(stateClone, 'loggedIn.displayName', displayName);
        set(stateClone, 'loggedIn.alexaSessionTokenActive', alexaSessionTokenActive);

        // default for edits
        set(stateClone, 'edittedUsername', username);
        set(stateClone, 'edittedDisplayName', displayName);

        return stateClone;
    },
    [actionTypes.UPDATE_SEARCH_QUERY](state, action){
        const stateClone = cloneDeep(state);
        const searchQuery = get(action.payload, 'query', '').toLowerCase();
        set(stateClone, 'searchQuery', searchQuery);
        return stateClone;
    },
    [actionTypes.SEARCH_FOR_USER](state, action){
        const stateClone = cloneDeep(state);
        const searchedUserId = get(action.payload, 'searchedUserId', '');
        set(stateClone, 'searchedUserId', searchedUserId);
        set(stateClone, 'searchRequested', true);
        return stateClone;
    },
    [actionTypes.CLEAR_SEARCH_CONFIRMATION](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'searchedUserId', '');
        set(stateClone, 'searchQuery', '');
        set(stateClone, 'searchRequested', false);
        return stateClone;
    },
    [actionTypes.OPEN_EDIT_USER_INFO_MODAL](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'editUserInfoModalOpen', true);
        return stateClone;
    },
    [actionTypes.CLOSE_EDIT_USER_INFO_MODAL](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'editUserInfoModalOpen', false);
        return stateClone;
    },
    [actionTypes.CHANGED_USERNAME_TEXT](state, action){
        const stateClone = cloneDeep(state);
        const username = get(action, 'payload.username', '').toLowerCase();
        set(stateClone, 'edittedUsername', username);
        return stateClone;
    },
    [actionTypes.CHANGED_DISPLAY_NAME_TEXT](state, action){
        const stateClone = cloneDeep(state);
        set(stateClone, 'edittedDisplayName', action.payload.displayName);
        return stateClone;
    },
});