import React, { Component } from 'react';
import { Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Container, Footer, FooterTab, Button, Icon, StyleProvider } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import PushNotification from 'react-native-push-notification';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';

import Home from '../screens/Home';
import Friends from '../screens/Friends';
import Settings from '../screens/Settings';

import SpinnerModal from '../components/SpinnerModal';
import ProfilePreviewModal from '../components/ProfilePreviewModal';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import tabsSelector from '../selectors/tabs';
import authenticationSelector from '../selectors/authentication';
import spinnerSelector from '../selectors/spinner';
import friendsSelector from '../selectors/friends';

class TabsContainer extends Component {

    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        // APP ENTRY POINT!!!
        await this.props.getSessionTokenFromLocalStorage();
        await this.props.getLoggedInUserInfo();

        if(this.props.sessionToken === '' || this.props.sessionToken === null){
            // remove tabs screen from stack history
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Authentication' })],
            });
            this.props.navigation.dispatch(resetAction);
        }
        else{
            this.props.getEvents();
            this.props.getNotifications();
            this.props.getFriendsList();
        }
 
        // Setup push notifications
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: (token) => {
                this.props.updateUserInfo({pushObject: token}, false);
            },
            
            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
                // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
                if(Platform.OS === 'ios'){
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },
            
            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: '119662908325',
            
            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            
            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,
            
            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: true
        });

        PushNotification.setApplicationIconBadgeNumber(0);
    }

    componentDidUpdate() {
        if(this.props.sessionToken === '' || this.props.sessionToken === null){
            // remove tabs screen from stack history
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Authentication' })],
            });
            this.props.navigation.dispatch(resetAction);
        }
    }
    
    getContent() {
        switch(this.props.activeTabIndex){
            case 0: 
                return <Home navigation={this.props.navigation} />;
            case 1: 
                return <Friends navigation={this.props.navigation} />;
            case 2: 
                return <Settings navigation={this.props.navigation} />;                                           
            default:
                return <Home/>;
        }
    }

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    {this.getContent()}
                    <SpinnerModal hideSpinner={this.props.hideSpinner} visible={this.props.spinnerVisible} message={this.props.spinnerMessage} />
                    <ProfilePreviewModal 
                        isOpen={this.props.profilePreviewModalVisible}
                        onRequestClose={this.props.closeProfilePreviewModal}
                        profile={this.props.profileToPreview}
                        friendStatus={this.props.friendStatus}
                        removeFriend={this.props.removeFriend.bind(this)}
                    />
                    <Footer>
                        <FooterTab>
                            <Button active={this.props.activeTabIndex === 0} onPress={() => { this.props.setActiveTab(0) }}>
                                <Icon active={this.props.activeTabIndex === 0} name="calendar" />
                            </Button>
                            <Button active={this.props.activeTabIndex === 1} onPress={() => { this.props.setActiveTab(1) }}>
                                <Icon active={this.props.activeTabIndex === 1} name="people" />
                            </Button>
                            <Button active={this.props.activeTabIndex === 2} onPress={() => { this.props.setActiveTab(2) }}>
                                <Icon active={this.props.activeTabIndex === 2} name="options" />
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </StyleProvider>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        activeTabIndex: tabsSelector(state).activeTabIndex,
        sessionToken: authenticationSelector(state).sessionToken,
        spinnerVisible: spinnerSelector(state).visible,
        spinnerMessage: spinnerSelector(state).message,
        profilePreviewModalVisible: friendsSelector(state).profilePreviewModalVisible,
        profileToPreview: friendsSelector(state).profileToPreview,
        friendStatus: friendsSelector(state).friendStatus
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsContainer);