import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';

import createReducer from '../utils/createReducer';
import * as actionTypes from '../constants/actionTypes';
import applicationState from './applicationState';

export const dealsReducer = createReducer(applicationState.deals, {
  [actionTypes.LIKE_DEAL](state, action) {
    const stateClone = cloneDeep(state);
    const currentCount = get(
      stateClone,
      ['counter', action.payload.id, 'count'],
      0,
    );
    set(stateClone, ['counter', action.payload.id, 'count'], currentCount + 1);
    return stateClone;
  },
});
