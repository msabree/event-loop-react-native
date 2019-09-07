import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Content, List, ListItem, Text, Body, Right, Button, Icon } from 'native-base';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import userSelector from '../selectors/users';

class Settings extends Component {

    componentDidMount() {
        this.props.getLoggedInUserInfo();
    }

    static navigationOptions = {
        title: 'Settings',
        header: {
            visible: true
        }
    };

    confirmLogout() {
        Alert.alert(
            'Confirm Logout',
            `Are you sure you want to logout?`,
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes', onPress: () => {
                        this.props.removeSession()
                    }
                },
            ],
            {cancelable: false},
        );    
    }

    render() {
        return (
            <Content>
                <List>
                    {/* <ListItem itemDivider>
                        <Text>Device</Text>
                    </ListItem>                    
                    <ListItem onPress={() => { this.props.navigation.navigate('AlexaConnections', {
                        activeAlexaConnection: this.props.loggedInActiveAlexaConnection
                    }); }}>
                        <Body>
                            <Text>Alexa</Text>
                            <Text note>{this.props.loggedInActiveAlexaConnection === true ? 'Active connection' : 'No connection'}</Text>
                        </Body>
                    </ListItem> */}
                    <ListItem itemDivider>
                        <Text>Account</Text>
                    </ListItem>                    
                    <ListItem icon>
                        <Body>
                            <Text>{'Logout'}</Text>
                        </Body>
                        <Right>
                            <Button transparent dark onPress={() => {
                                this.confirmLogout()
                            }}>
                                <Icon name='log-out' />
                            </Button>
                        </Right>
                    </ListItem>
                </List>
            </Content>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        loggedInActiveAlexaConnection: userSelector(state).loggedInActiveAlexaConnection,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);