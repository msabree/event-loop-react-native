import React, { Component } from 'react';
import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Segment, Button, StyleProvider } from 'native-base';
import Autocomplete from 'react-native-autocomplete-input';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import friendsSelector from '../selectors/friends';
import usersSelector from '../selectors/users';
import searchSelector from '../selectors/search';

const styles = StyleSheet.create({
    searchBoxContainer: {
        flex: 1,
        paddingTop: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    autocompleteContainer: {
        marginLeft: 10,
        marginRight: 10,
    },
    inputContainerStyle: {}
});

class Friends extends Component {

    componentDidMount() {
        this.props.getFriendsList();
    }

    confirmRemoveFriend(friendUserId) {
        Alert.alert(
            'Remove Friend',
            `Are you sure you want to remove friend?`,
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes', onPress: () => {
                        this.props.removeFriend(friendUserId);
                    }
                },
            ],
            {cancelable: false},
        );    
    }

    confirmDeleteFriendRequest(requestId) {
        Alert.alert(
            'Delete Friend Request',
            `Are you sure you want to delete this friend request?`,
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes', onPress: () => {
                        this.props.respondToRequest(requestId, false)
                    }
                },
            ],
            {cancelable: false},
        );    
    }

    confirmFriend(requestId) {
        Alert.alert(
            'Confirm Friend Request',
            `Are you sure you want to add this user as friend?`,
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes', onPress: () => {
                        this.props.respondToRequest(requestId, true)
                    }
                },
            ],
            {cancelable: false},
        );    
    }

    getContent() {
        if(this.props.activeSegment === 'current'){
            return this.getCurrent();
        }
        else{
            return this.getRequests();
        }
    }

    getCurrent() {
        return (
            this.props.current.map((currFriend, index) => {
                return (
                    <ListItem avatar key={`${new Date().getTime()} - ${index}`}>
                        <Left>
                            <Thumbnail source={{ uri: currFriend._profilePic }} />
                        </Left>
                        <Body>
                            <Text>{currFriend._displayName || currFriend._username || ''}</Text>
                            <Text note>Confirmed: {moment(currFriend.dateAdded).format("MMM Do YYYY")}</Text>
                            <Text note>{' '}</Text>
                        </Body>
                        <Right>
                            <Button danger transparent onPress={() => { this.confirmRemoveFriend(currFriend.friendUserId); }}>
                                <Text>Remove</Text>
                            </Button>
                        </Right>
                    </ListItem>
                )
            })
        )
    }

    getRequests() {
        return (
            this.props.requests.map((currRequest, index) => {
                return (
                    <ListItem avatar key={`${new Date().getTime()} - ${index}`}>
                        <Left>
                            <Thumbnail source={{ uri: currRequest._profilePic }} />
                        </Left>
                        <Body>
                            <Text>{currRequest._displayName || currRequest._username || 'Jane Doe'}</Text>
                            <Text note>Requested: {moment(currRequest.dateRequested).format("MMM Do YYYY")}</Text>
                            <Button danger transparent onPress={() => { this.confirmDeleteFriendRequest(currRequest.requestId) }}>
                                <Text style={{fontSize: 12}}>Delete friend request.</Text>
                            </Button>
                        </Body>
                        <Right>
                            <Button success transparent onPress={() => { this.confirmFriend(currRequest.requestId) }}>
                                <Text>Confirm</Text>
                            </Button>
                        </Right>
                    </ListItem>
                )
            })
        )        
    }

    getSearchResultButton(type, potentialFriendUserId){
        if(type === 'invite'){
            return (
                <Button success transparent onPress={() => {}}>
                    <Text>Invite</Text>
                </Button>
            )
        }
        else if(type === 'add'){
            return (
                <Button success transparent onPress={() => {
                    this.props.sendFriendRequest(potentialFriendUserId);
                }}>
                    <Text>Friend Request</Text>
                </Button>
            )   
        }
    }

    switchSegment(segment) {
        if(this.props.activeSegment !== segment){
            this.props.getFriendsList();
            this.props.setFriendsActiveSegment(segment);
        }
    }

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Content>                    
                    <Autocomplete
                        autoCapitalize='none'
                        autoCorrect={false}
                        containerStyle={styles.autocompleteContainer}
                        inputContainerStyle={styles.inputContainerStyle}
                        data={this.props.suggestions}
                        defaultValue={''}
                        placeholder={'Search by phone contact name or username.'}
                        onChangeText={(query) => {
                            this.props.search(query)
                        }}
                        renderItem={({ item, i }) => (
                            <ListItem avatar>
                                <Left>
                                    <Thumbnail source={{uri: item.pic}} />
                                </Left>
                                <Body>
                                    <Text>{item.nameIdentifier}</Text>
                                    <Text note>{item.phone}</Text>
                                    <Text note>{' '}</Text>
                                </Body>
                                <Right>
                                    {this.getSearchResultButton(item.type)}
                                </Right>
                            </ListItem>
                        )}
                    />
                    <Segment style={getTheme(platform)}>
                        <Button transparent first active={this.props.activeSegment === 'current'} onPress={() => {this.switchSegment('current')}}>
                            <Text>Friends</Text>
                        </Button>
                        <Button transparent last active={this.props.activeSegment === 'requests'} onPress={() => {this.switchSegment('requests')}}>
                            <Text>Requests</Text>
                        </Button>
                    </Segment>
                    <List>
                        {this.getContent()}
                    </List>
                </Content>
            </StyleProvider>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        activeSegment: friendsSelector(state).activeSegment,
        current: friendsSelector(state).current,
        requests: friendsSelector(state).requests,
        suggestions: searchSelector(state).suggestions,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends);