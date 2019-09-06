import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const alexaReducer = createReducer(applicationState.alexa, {
    [actionTypes.ALEXA_SYNC_CODE](state, action){
        const stateClone = cloneDeep(state);
        const syncCode = action.payload.syncCode.toString();
        set(stateClone, 'syncCode', `${syncCode.charAt(0)}${syncCode.charAt(1)}-${syncCode.charAt(2)}${syncCode.charAt(3)}`);
        return stateClone;
    },
    [actionTypes.ALEXA_SYNC_CONFIRM](state){
        const stateClone = cloneDeep(state);
        set(stateClone, 'showConfirmation', true);
        return stateClone;
    },
})