import * as TabActions from './tabs';
import * as FormActions from './forms';
import * as SpinnerActions from './spinner';
import * as AuthenticationActions from './authentication';
import * as EventActions from './events';
import * as FriendsActions from './friends';
import * as GroupsActions from './groups';
import * as UsersActions from './users';
import * as AlexaActions from './alexa';
import * as NotificationsActions from './notifications';
import * as SearchActions from './search';
import * as DealsActions from './deals';

export const ActionCreators = Object.assign(
  {},
  TabActions,
  FormActions,
  SpinnerActions,
  AuthenticationActions,
  EventActions,
  FriendsActions,
  GroupsActions,
  UsersActions,
  AlexaActions,
  NotificationsActions,
  SearchActions,
  DealsActions,
);
