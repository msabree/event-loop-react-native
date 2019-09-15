import { combineReducers } from 'redux';
import * as authenticationReducer from './authentication';
import * as tabsReducer from './tabs';
import * as forms from './forms';
import * as events from './events';
import * as usersReducer from './users';
import * as friends from './friends';
import * as spinner from './spinner';
import * as alexa from './alexa';
import * as notifications from './notifications';
import * as search from './search';

export default combineReducers(Object.assign(
    authenticationReducer,
    tabsReducer,
    events,
    forms,
    usersReducer,
    friends,
    spinner,
    alexa,
    notifications,
    search,
))