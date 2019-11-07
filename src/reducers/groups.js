import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const groupsReducer = createReducer(applicationState.groups, {
  [actionTypes.GET_GROUPS](state, action) {
    const stateClone = cloneDeep(state);
    set(stateClone, 'current', get(action, 'payload.groups', []));
    return stateClone;
  },
  [actionTypes.UPDATE_GROUP](state, action) {
    const stateClone = cloneDeep(state);
    const objIndex = stateClone.current.findIndex(
      obj => obj.id === action.payload.id,
    );
    action.payload.members.map(item => {
      stateClone.current[objIndex].members.push(item);
    });
    return stateClone;
  },
  [actionTypes.SET_MANAGE_GROUP_MODAL_VISIBLE](state, action) {
    const stateClone = cloneDeep(state);
    set(
      stateClone,
      'editting.modalVisible',
      get(action, 'payload.isVisible', false),
    );
    set(stateClone, 'editting.groupId', get(action, 'payload.groupId', ''));
    return stateClone;
  },
  [actionTypes.SET_SELECTED_FRIEND_IDS](state, action) {
    const stateClone = cloneDeep(state);
    set(
      stateClone,
      'editting.selectedFriendIds',
      get(action, 'payload.selectedFriendIds', []),
    );
    return stateClone;
  },
});
