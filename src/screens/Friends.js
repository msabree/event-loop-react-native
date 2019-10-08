import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Content, List, ListItem, Left, Body, Right, Text, Segment, Button, Icon } from 'native-base';
import Autocomplete from 'react-native-autocomplete-input';
import moment from 'moment';
import debounce from 'lodash/debounce';

import UserProfilePicture from '../components/UserProfilePicture';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import friendsSelector from '../selectors/friends';
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
    thumbnail: {
        width: 60,
        height: 60,
    },
    inputContainerStyle: {}
});

class Friends extends Component {

    constructor(props){
        super(props);
        this.state = {
            hideAutoComplete: false,
        }
    }

    componentDidMount() {
        this.props.getFriendsList();
    }

    confirmDeleteFriendRequest(userId) {
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
                    text: 'Yes', 
                    onPress: () => {
                        this.props.respondToRequest(userId, false)
                    },
                    style: 'destructive'
                },
            ],
            {cancelable: false},
        );    
    }

    confirmCancelSentFriendRequest(userId) {
        Alert.alert(
            'Cancel Friend Request',
            `Are you sure you want to cancel this sent friend request?`,
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes', 
                    onPress: () => {
                        this.props.respondToRequest(userId, false)
                    },
                    style: 'destructive'
                },
            ],
            {cancelable: false},
        );    
    }

    confirmFriend(userId) {
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
                    text: 'Yes', 
                    onPress: () => {
                        this.props.respondToRequest(userId, true)
                    },
                    style: 'destructive'
                },
            ],
            {cancelable: false},
        );    
    }

    getContent() {
        if(this.props.activeSegment === 'current'){
            return this.getCurrent();
        }
        else if(this.props.activeSegment === 'requests'){
            return this.getRequests();
        }
        else{
            return this.getSentRequests();
        }
    }

    getCurrent() {
        return (
            this.props.current.map((currFriend, index) => {
                return (
                    <ListItem avatar key={`${new Date().getTime()} - ${index}`} onPress={() => { this.props.showProfilePreviewModal({
                        profilePic: currFriend._profilePic,
                        username: currFriend._username,
                        displayName: currFriend._displayName,
                        userId: currFriend.friendUserId,
                    }, true) }}>
                        <Left>
                            <UserProfilePicture profile={{userId: currFriend.friendUserId, profilePic: currFriend._profilePic}} style={styles.thumbnail}/>
                        </Left>
                        <Body>
                            <Text>{currFriend._displayName || currFriend._username || ''}</Text>
                            <Text note>Confirmed: {moment(currFriend.dateAdded).format("MMM Do YYYY")}</Text>
                            <Text note>{(currFriend.starred === true) ? 'Subscribed to new event posts' : 'Not subscribed to new event posts'}</Text>
                        </Body>
                        <Right>
                            <Button dark transparent onPress={() => { this.props.showProfilePreviewModal({
                                profilePic: currFriend._profilePic,
                                username: currFriend._username,
                                displayName: currFriend._displayName,
                                userId: currFriend.friendUserId,
                            }, true) }}>
                                <Icon name="information-circle-outline" />
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
                            <UserProfilePicture profile={{userId: currRequest.requestorUserId, profilePic: currRequest._profilePic}} style={styles.thumbnail}/>
                        </Left>
                        <Body>
                            <Text>{currRequest._displayName || currRequest._username || 'Jane Doe'}</Text>
                            <Text note>Requested: {moment(currRequest.dateRequested).format("MMM Do YYYY")}</Text>
                            <Button danger transparent onPress={() => { this.confirmDeleteFriendRequest(currRequest.requestorUserId) }}>
                                <Text style={{fontSize: 12}}>Delete friend request.</Text>
                            </Button>
                        </Body>
                        <Right>
                            <Button success transparent onPress={() => { this.confirmFriend(currRequest.requestorUserId) }}>
                                <Text>Confirm</Text>
                            </Button>
                        </Right>
                    </ListItem>
                )
            })
        )        
    }

    getSentRequests() {
        return (
            this.props.sentRequests.map((currRequest, index) => {
                return (
                    <ListItem avatar key={`${new Date().getTime()} - ${index}`}>
                        <Left>
                            <UserProfilePicture profile={{userId: currRequest.userId, profilePic: currRequest._profilePic}} style={styles.thumbnail}/>
                        </Left>
                        <Body>
                            <Text>{currRequest._displayName || currRequest._username || 'Jane Doe'}</Text>
                            <Text note>Sent: {moment(currRequest.dateRequested).fromNow()}</Text>
                            <Button danger transparent onPress={() => { this.confirmCancelSentFriendRequest(currRequest.userId) }}>
                                <Text style={{fontSize: 12}}>Cancel sent friend request.</Text>
                            </Button>
                        </Body>
                        <Right/>
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
                    <Text>Send Request</Text>
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
            <Content>    
                {/* <Button transparent dark onPress={() => this.props.navigation.navigate('Groups')}>
                    <Text>Manage Groups</Text>
                </Button>                 */}
                <Autocomplete
                    autoCapitalize='none'
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    inputContainerStyle={styles.inputContainerStyle}
                    data={this.props.suggestions}
                    defaultValue={''}
                    placeholder={'Search by phone contact name or username.'}
                    onChangeText={debounce((query) => {
                        this.props.search(query)
                    }, 2000)}
                    hideResults={this.state.hideAutoComplete}
                    onBlur={() => {
                        this.setState({
                            hideAutoComplete: true,
                        })
                    }}
                    onFocus={() => {
                        this.setState({
                            hideAutoComplete: false,
                        })
                    }}
                    renderItem={({ item, index }) => (
                        <ListItem avatar>
                            <Left>
                                <UserProfilePicture profile={{userId: `${new Date().getTime()} - ${index}`, profilePic: item.pic}} style={styles.thumbnail}/>
                            </Left>
                            <Body>
                                <Text>{item.username}</Text>
                                <Text note>{item.displayName}</Text>
                                <Text note>{' '}</Text>
                            </Body>
                            <Right>
                                {this.getSearchResultButton(item.type, item.userId)}
                            </Right>
                        </ListItem>
                    )}
                />
                <Segment>
                    <Button transparent warning first active={this.props.activeSegment === 'current'} onPress={() => {this.switchSegment('current')}}>
                        <Text>Friends</Text>
                    </Button>
                    <Button transparent warning second active={this.props.activeSegment === 'requests'} onPress={() => {this.switchSegment('requests')}}>
                        <Text>Requests</Text>
                    </Button>
                    <Button transparent warning last active={this.props.activeSegment === 'sent'} onPress={() => {this.switchSegment('sent')}}>
                        <Text>Sent</Text>
                    </Button>
                </Segment>
                <List>
                    {this.getContent()}
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
        activeSegment: friendsSelector(state).activeSegment,
        current: friendsSelector(state).current,
        requests: friendsSelector(state).requests,
        sentRequests: friendsSelector(state).sentRequests,
        suggestions: searchSelector(state).suggestions,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends);