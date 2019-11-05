import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const groupsReducer = createReducer(applicationState.groups, {
  [actionTypes.CREATE_GROUP](state, action) {
    const stateClone = cloneDeep(state);
    stateClone.push({
      title: action.payload.title,
      members: action.payload.members,
      //id probably needs to be changed from date.now
      id: Date.now(),
    });
    return stateClone;
  },
  [actionTypes.EDIT_GROUP](state, action) {
    const stateClone = cloneDeep(state);
    const objIndex = stateClone.findIndex(obj => obj.id === action.payload.id);
    // stateClone[objIndex].members = action.payload.members;
    console.log(stateClone[objIndex].members);
    console.log(action.payload.members);
    action.payload.members.map(item => {
      console.log(item);
      stateClone[objIndex].members.push(item);
    });
    console.log(stateClone);
    return stateClone;
  },
  [actionTypes.SET_MANAGE_GROUP_MODAL_VISIBLE](state, action) {
    const stateClone = cloneDeep(state);
    set(stateClone, 'modalVisible', get(action, 'payload.isVisible', false));
    return stateClone;
  },
});
