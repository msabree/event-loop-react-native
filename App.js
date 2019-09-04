import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';

import Tabs from './src/containers/Tabs';
import Authentication from './src/containers/Authentication';
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
        CreateEvent: {
            screen: CreateEvent,
        },
        GuestList: {
            screen: GuestList,
        }
    },
    {
        initialRouteName: 'Authentication'
    }
);
  
export default createAppContainer(AppNavigator);