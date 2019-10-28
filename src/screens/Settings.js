import React, {Component} from 'react';
import {Alert} from 'react-native';
import {
  Badge,
  Content,
  List,
  ListItem,
  Text,
  Body,
  Right,
  Button,
  Icon,
  Left,
  Thumbnail,
} from 'native-base';
import {getVersion} from 'react-native-device-info';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../actions';

import userSelector from '../selectors/users';
import notificationsSelector from '../selectors/notifications';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: '',
    };

    getVersion().then(version => {
      this.setState({
        version,
      });
    });
  }

  componentDidMount() {
    this.props.getLoggedInUserInfo();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.notifyFriendRequests !== prevProps.notifyFriendRequests ||
      this.props.notifyHostEventChanges !== prevProps.notifyHostEventChanges ||
      this.props.notifyJoinedEventChanges !== prevProps.notifyJoinedEventChanges
    ) {
      this.props.getLoggedInUserInfo();
    }
  }

  confirmLogout() {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.props.removeSession();
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <Content contentContainerStyle={{marginTop: 20}}>
        <List>
          <ListItem itemDivider>
            <Text>Profile</Text>
          </ListItem>
          <ListItem
            avatar
            onPress={() => {
              this.props.navigation.navigate('Profile');
            }}>
            <Left>
              <Thumbnail source={{uri: this.props.loggedInProfilePic}} />
            </Left>
            <Body>
              <Text>{this.props.loggedInDisplayName}</Text>
              <Text note>{this.props.loggedInUsername}</Text>
              <Text note />
              <Text note />
            </Body>
            <Right>
              <Button
                transparent
                dark
                onPress={() => {
                  this.props.navigation.navigate('Profile');
                }}>
                <Icon name="create" style={{color: '#CBCE74'}} />
              </Button>
            </Right>
          </ListItem>
          <ListItem itemDivider>
            <Text>Notifications</Text>
          </ListItem>
          <ListItem
            icon
            onPress={() => {
              this.props.navigation.navigate('Notifications');
            }}>
            <Body>
              <Text note>{'View notifications'}</Text>
            </Body>
            <Right>
              <Button
                transparent
                dark
                onPress={() => {
                  this.props.navigation.navigate('Notifications');
                }}>
                <Badge
                  style={
                    this.props.badgeCount === 0
                      ? {marginRight: 10, backgroundColor: 'grey'}
                      : {marginRight: 10}
                  }>
                  <Text>{this.props.badgeCount}</Text>
                </Badge>
              </Button>
            </Right>
          </ListItem>
          <ListItem itemDivider>
            <Text>Push Notifications</Text>
          </ListItem>
          <ListItem icon>
            <Body>
              <Text note>{'New events from your starred friends.'}</Text>
            </Body>
            <Right>
              <Button
                transparent
                dark
                onPress={() => {
                  this.props.updateUserInfo({
                    notifyNewEvents: !this.props.notifyNewEvents,
                  });
                }}>
                {this.props.notifyNewEvents ? (
                  <Icon name="notifications" style={{color: '#5FC469'}} />
                ) : (
                  <Icon name="notifications-off" />
                )}
              </Button>
            </Right>
          </ListItem>
          <ListItem icon>
            <Body>
              <Text note>{'Incoming friend requests.'}</Text>
            </Body>
            <Right>
              <Button
                transparent
                dark
                onPress={() => {
                  this.props.updateUserInfo({
                    notifyFriendRequests: !this.props.notifyFriendRequests,
                  });
                }}>
                {this.props.notifyFriendRequests ? (
                  <Icon name="notifications" style={{color: '#5FC469'}} />
                ) : (
                  <Icon name="notifications-off" />
                )}
              </Button>
            </Right>
          </ListItem>
          <ListItem icon>
            <Body>
              <Text note>
                {'User joins, leaves, or comments on your event.'}
              </Text>
            </Body>
            <Right>
              <Button
                transparent
                dark
                onPress={() => {
                  this.props.updateUserInfo({
                    notifyHostEventChanges: !this.props.notifyHostEventChanges,
                  });
                }}>
                {this.props.notifyHostEventChanges ? (
                  <Icon name="notifications" style={{color: '#5FC469'}} />
                ) : (
                  <Icon name="notifications-off" />
                )}
              </Button>
            </Right>
          </ListItem>
          <ListItem icon>
            <Body>
              <Text note>{'Changes to an event you joined.'}</Text>
            </Body>
            <Right>
              <Button
                transparent
                dark
                onPress={() => {
                  this.props.updateUserInfo({
                    notifyJoinedEventChanges: !this.props
                      .notifyJoinedEventChanges,
                  });
                }}>
                {this.props.notifyJoinedEventChanges ? (
                  <Icon name="notifications" style={{color: '#5FC469'}} />
                ) : (
                  <Icon name="notifications-off" />
                )}
              </Button>
            </Right>
          </ListItem>
          <ListItem itemDivider>
            <Text>Device</Text>
          </ListItem>
          <ListItem
            icon
            onPress={() => {
              this.props.navigation.navigate('AlexaConnections');
            }}>
            <Body>
              <Text note>Connect to Alexa</Text>
            </Body>
            <Right>
              <Button
                transparent
                dark
                onPress={() => {
                  this.props.navigation.navigate('AlexaConnections');
                }}>
                <Icon name="radio-button-on" style={{color: '#427CBF'}} />
              </Button>
            </Right>
          </ListItem>
          <ListItem
            icon
            onPress={() => {
              this.confirmLogout();
            }}>
            <Body>
              <Text note>{'Logout'}</Text>
            </Body>
            <Right>
              <Button
                transparent
                dark
                onPress={() => {
                  this.confirmLogout();
                }}>
                <Icon name="log-out" style={{color: '#F3757D'}} />
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
    loggedInProfilePic: userSelector(state).loggedInProfilePic,
    loggedInUsername: userSelector(state).loggedInUsername,
    loggedInDisplayName: userSelector(state).loggedInDisplayName,
    notifyNewEvents: userSelector(state).notifyNewEvents,
    notifyFriendRequests: userSelector(state).notifyFriendRequests,
    notifyHostEventChanges: userSelector(state).notifyHostEventChanges,
    notifyJoinedEventChanges: userSelector(state).notifyJoinedEventChanges,
    badgeCount: notificationsSelector(state).badgeCount,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
