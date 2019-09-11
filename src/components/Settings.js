import React, { Component } from 'react';
import { Alert} from 'react-native';
import { Content, List, ListItem, Text, Body, Right, Button, Icon, Left, Thumbnail } from 'native-base';
import { getVersion } from 'react-native-device-info';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import userSelector from '../selectors/users';

class Settings extends Component {

    constructor(props){
        super(props);
        this.state = {
            version: '',
        }

        getVersion().then((version) => {
            this.setState({
                version 
            })
        })
    }

    componentDidMount() {
        this.props.getLoggedInUserInfo();
    }

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
                        <Text>Profile</Text>
                    </ListItem>  
                    <ListItem avatar onPress={() => {
                        this.props.navigation.navigate('Profile')
                    }}> 
                        <Left>
                            <Thumbnail source={{ uri: this.props.loggedInProfilePic }} />
                        </Left>
                        <Body>
                            <Text>{this.props.loggedInDisplayName}</Text>
                            <Text note>{this.props.loggedInUsername}</Text>
                            <Text note>{' '}</Text>
                            <Text note>{' '}</Text>
                        </Body>
                        <Right>
                            <Button transparent dark onPress={() => {
                                this.props.navigation.navigate('Profile')
                            }}>
                                <Icon name='create' />
                            </Button>
                        </Right>
                    </ListItem>
                    {/* <ListItem itemDivider>
                        <Text>Push Notificatons</Text>
                    </ListItem>                 
                    <ListItem icon>
                        <Body>
                            <Text note>{'Incoming friend requests.'}</Text>
                        </Body>
                        <Right>
                            <Button transparent dark onPress={() => {}}>
                                <Icon name='notifications-off' />
                            </Button>
                        </Right>
                    </ListItem>
                    <ListItem icon>
                        <Body>
                            <Text note>{'Someone joins/leaves your event.'}</Text>
                        </Body>
                        <Right>
                            <Button transparent dark onPress={() => {}}>
                                <Icon name='notifications-off' />
                            </Button>
                        </Right>
                    </ListItem>
                    <ListItem icon>
                        <Body>
                            <Text note>{'Event changes to an event you joined.'}</Text>
                        </Body>
                        <Right>
                            <Button transparent dark onPress={() => {}}>
                                <Icon name='notifications-off' />
                            </Button>
                        </Right>
                    </ListItem> */}
                    <ListItem itemDivider>
                        <Text>Device</Text>
                    </ListItem>                    
                    <ListItem icon>
                        <Body>
                            <Text note>{'Logout'}</Text>
                        </Body>
                        <Right>
                            <Button transparent dark onPress={() => {
                                this.confirmLogout()
                            }}>
                                <Icon name='log-out' />
                            </Button>
                        </Right>
                    </ListItem>
                    <ListItem icon>
                        <Body>
                            <Text note>{`Version ${this.state.version}`}</Text>
                        </Body>
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
        loggedInProfilePic: userSelector(state).loggedInProfilePic,
        loggedInUsername: userSelector(state).loggedInUsername,
        loggedInDisplayName: userSelector(state).loggedInDisplayName,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);