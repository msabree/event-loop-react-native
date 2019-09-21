import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const authenticationReducer = createReducer(applicationState.authentication, {
    [actionTypes.INVALID_SESSION](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'invalidSession', true)
        set(stateClone, 'sessionToken', null);
        set(stateClone, 'verificationCodeRequested', false);
        return stateClone;
    },
    [actionTypes.HERO_MODE](state){
        const stateClone = cloneDeep(state);
        // DEBUG SESSION 
        set(stateClone, 'heroMode', true);
        set(stateClone, 'sessionToken', 'dcfd780b-827f-4fda-97ea-ba27402e7dcc');
        set(stateClone, 'verificationCodeRequested', false);
        return stateClone;
    },
    [actionTypes.CLEARED_INVALID_SESSION](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'invalidSession', false);
        set(stateClone, 'heroMode', false);
        set(stateClone, 'sessionToken', null);
        return stateClone;
    },
    [actionTypes.GET_SESSION_TOKEN_FROM_LOCAL_STORAGE](state, action){
        const stateClone = cloneDeep(state);
        set(stateClone, 'sessionToken', action.payload.sessionToken);
        return stateClone;
    },
    [actionTypes.CHANGED_PHONE_NUMBER_TEXT](state, action){
        const stateClone = cloneDeep(state);
        set(stateClone, 'phoneNumber', action.payload.phoneNumber);
        return stateClone;
    },
    [actionTypes.CHANGED_VERIFICATION_CODE_TEXT](state, action){
        const stateClone = cloneDeep(state);
        set(stateClone, 'verificationCode', action.payload.verificationCode);
        return stateClone;
    },
    [actionTypes.REQUEST_VERIFICATION_CODE](state, action){
        const stateClone = cloneDeep(state);
        console.log(action.payload.apiResponse)
        const verificationCodeRequested = get(action.payload.apiResponse, 'success', false);
        if(verificationCodeRequested === false){
            alert('Unable to request a code, please try again later.');
        }
        else{
            set(stateClone, 'verificationCodeRequested', true);
        }
        return stateClone;
    },
    [actionTypes.VERIFY_PHONE_NUMBER](state, action){
        const stateClone = cloneDeep(state);
        const codeVerified = get(action.payload.apiResponse, 'success', false);
        const failureMessage = get(action.payload.apiResponse, 'message', '');
        const sessionToken = get(action.payload.apiResponse, 'sessionToken', '');
        if(codeVerified === false){
            alert(`Unable to confirm phone number. ${failureMessage}`);
        }
        else if(sessionToken === ''){
            alert('Something went wrong in the authentication process. Please try again later.');
            set(stateClone, 'sessionToken', null);
            set(stateClone, 'verificationCodeRequested', false);
        }
        else{
            set(stateClone, 'sessionToken', sessionToken);
            set(stateClone, 'verificationCodeRequested', false);
        }
        return stateClone;
    },
});