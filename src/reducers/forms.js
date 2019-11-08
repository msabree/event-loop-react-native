import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

const minDateTime = new Date();
minDateTime.setHours(minDateTime.getHours() + 1); // 1 hour from now

export const formsReducer = createReducer(applicationState.forms, {
  [actionTypes.INPUT_CHANGE](state, action) {
    const stateClone = cloneDeep(state);
    const path = get(action.payload, 'path', '');
    const value = get(action.payload, 'value', '');
    if (path !== '') {
      set(stateClone, path, value);
      return stateClone;
    } else {
      console.log('Path cannot be empty');
    }
  },
  [actionTypes.RESET_EVENT_FORMS](state) {
    const stateClone = cloneDeep(state);

    // Physical Location Event
    set(stateClone, 'physicalLocationEvent.startDatetime', new Date());
    set(stateClone, 'physicalLocationEvent.endDatetime', new Date(minDateTime));
    set(stateClone, 'physicalLocationEvent.location', null);
    set(stateClone, 'physicalLocationEvent.details', '');
    set(stateClone, 'physicalLocationEvent.title', '');

    // Phone Call Event
    set(stateClone, 'phoneCallEvent.startDatetime', new Date());
    set(stateClone, 'phoneCallEvent.endDatetime', new Date());
    set(stateClone, 'phoneCallEvent.phoneNumber', '');
    set(stateClone, 'phoneCallEvent.passCode', '');
    set(stateClone, 'phoneCallEvent.details', '');
    set(stateClone, 'phoneCallEvent.title', '');

    // Video Chat Event
    set(stateClone, 'videoChatEvent.startDatetime', new Date());
    set(stateClone, 'videoChatEvent.endDatetime', new Date());
    set(stateClone, 'videoChatEvent.meetingLink', '');
    set(stateClone, 'videoChatEvent.details', '');
    set(stateClone, 'videoChatEvent.title', '');

    return stateClone;
  },
  [actionTypes.RESET_APPFEEDBACK_FORM](state) {
    const stateClone = cloneDeep(state);
    set(stateClone, 'appFeedback.feedback', '');
    return stateClone;
  },
  [actionTypes.RESET_GROUP_MANAGEMENT_FORM](state) {
    const stateClone = cloneDeep(state);
    set(stateClone, 'manageGroups.title', '');
    return stateClone;
  },
});
