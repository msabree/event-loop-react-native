import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';

import Tabs from './src/containers/Tabs';
import Authentication from './src/containers/Authentication';
import Profile from './src/components/Profile';
import CreateEvent from './src/components/CreateEvent';
import GuestList from './src/components/GuestList';

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
        }
    },
    {
        initialRouteName: 'Tabs',
        headerMode: 'screen'
    }
);
  
export default createAppContainer(AppNavigator);