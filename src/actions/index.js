import * as TabActions from './tabs';
import * as FormActions from './forms';
import * as SpinnerActions from './spinner';
import * as AuthenticationActions from './authentication';
import * as EventActions from './events';
import * as FriendsActions from './friends';
import * as UsersActions from './users';
import * as AlexaActions from './alexa';
import * as NotificationsActions from './notifications';
import * as SearchActions from './search';

export const ActionCreators = Object.assign({}, 
    TabActions,
    FormActions,
    SpinnerActions,
    AuthenticationActions,
    EventActions,
    FriendsActions,
    UsersActions,
    AlexaActions,
    NotificationsActions,
    SearchActions,
);