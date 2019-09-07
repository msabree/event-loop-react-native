import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Segment, Button, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import friendsSelector from '../selectors/friends';
import usersSelector from '../selectors/users';

class Friends extends Component {

    componentDidMount() {
        this.props.getFriendsList();
    }

    componentDidUpdate() {
        if(this.props.searchRequested === false){
            return;
        }
        else if(this.props.searchedUserId !== '' && this.props.searchQuery !== ''){
            Alert.alert(
                'Friend Request',
                `Would you like to send friend request to ${this.props.searchQuery}?`,
                [
                    {
                        text: 'No',
                        onPress: () => {
                            this.props.resetFriendSearch();
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'Yes', onPress: () => {
                            this.props.sendFriendRequest();
                            this.props.resetFriendSearch();
                        }
                    },
                ],
                {cancelable: false},
            );
        }
        else if(this.props.searchedUserId === '' && this.props.searchQuery !== ''){
            Alert.alert(
                'Friend Request',
                `${this.props.searchQuery} not found.`,
                [
                    {
                        text: 'OK', onPress: () => {
                            this.props.resetFriendSearch();
                        }
                    },
                ],
                {cancelable: false},
            );
        }
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
                    <Segment style={getTheme(platform)}>
                        <Button first active={this.props.activeSegment === 'current'} onPress={() => {this.switchSegment('current')}}>
                            <Text>Friends</Text>
                        </Button>
                        <Button last active={this.props.activeSegment === 'requests'} onPress={() => {this.switchSegment('requests')}}>
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
        sendFriendRequestPending: friendsSelector(state).sendFriendRequestPending,
        searchedUserId: usersSelector(state).searchedUserId,
        searchQuery: usersSelector(state).searchQuery,
        searchRequested: usersSelector(state).searchRequested,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends);