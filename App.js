import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';

import Tabs from './src/containers/Tabs';
import Authentication from './src/containers/Authentication';
import Profile from './src/screens/Profile';
import Friends from './src/screens/Friends';
import Settings from './src/screens/Settings';
import CreateEvent from './src/screens/CreateEvent';
import GuestList from './src/screens/GuestList';
import AlexaConnections from './src/screens/AlexaConnections';
import AlexaSync from './src/screens/AlexaSync';
import Notifications from './src/screens/Notifications';
import Comments from './src/screens/Comments';

const AppNavigator = createStackNavigator(
    {
        Tabs: {
            screen: Tabs,
        },
        Authentication: {
            screen: Authentication,
        },
        Friends: {
            screen: Friends,
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