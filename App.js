import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';

import Tabs from './src/containers/Tabs';
import Authentication from './src/containers/Authentication';
import Profile from './src/components/Profile';
import Settings from './src/components/Settings';
import CreateEvent from './src/components/CreateEvent';
import GuestList from './src/components/GuestList';
import AlexaConnections from './src/components/AlexaConnections';
import AlexaSync from './src/components/AlexaSync';
import Notifications from './src/components/Notifications';
import Comments from './src/components/Comments';

const AppNavigator = createStackNavigator(
    {
        Tabs: {
            screen: Tabs,
        },
        Authentication: {
            screen: Authentication,
        },
        Profile: {
            screen: Profile,
        },
        CreateEvent: {
            screen: CreateEvent,
        },
        GuestList: {
            screen: GuestList,
        },
        Settings: {
            screen: Settings,
        },
        AlexaConnections: {
            screen: AlexaConnections,
        },
        AlexaSync: {
            screen: AlexaSync,
        },
        Notifications: {
            screen: Notifications,
        },
        Comments: {
            screen: Comments,
        },
    },
    {
        initialRouteName: 'Tabs',
        headerMode: 'screen'
    }
);
  
export default createAppContainer(AppNavigator);