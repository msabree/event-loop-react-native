import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const groupsReducer = createReducer(applicationState.groups, {
  [actionTypes.CREATE_GROUP](state, action) {
    const stateClone = cloneDeep(state);
    stateClone.current.push({
      title: action.payload.title,
      members: action.payload.members,
      //id probably needs to be changed from date.now
      id: Date.now(),
    });
    return stateClone;
  },
  [actionTypes.SAVE_GROUP](state, action) {
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
    set(stateClone, 'editting.groupId', get(action, 'payload.id', ''));
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
