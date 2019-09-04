import * as TabActions from './tabs';
import * as FormActions from './forms';
import * as AuthenticationActions from './authentication';
import * as EventActions from './events';
import * as FriendsActions from './friends';
import * as UsersActions from './users';
import * as AlexaSyncActions from './alexaSync';

export const ActionCreators = Object.assign({}, 
    TabActions,
    FormActions,
    AuthenticationActions,
    EventActions,
    FriendsActions,
    UsersActions,
    AlexaSyncActions,
);