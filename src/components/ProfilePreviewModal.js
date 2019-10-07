import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import React from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { Button, Text, Icon } from 'native-base';

import BasicModal from './BasicModal';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import friendsSelector from '../selectors/friends';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    profile: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 1,
        borderColor: 'grey',
        marginTop: 30,
    },
    buttonBar: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    innerContainer: {
        backgroundColor:'#fff',
        width: 300,
        maxHeight: 400,
        borderRadius: 14,
    },
    starIcon: {
        fontSize: 30,
        color: 'orange',
    },
    starIconOutline: {
        fontSize: 30,
    },
});

class ProfilePreviewModal extends React.Component {
    
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
                    text: 'Yes', 
                    onPress: async () => {
                        await this.props.removeFriend(friendUserId);
                        this.props.closeProfilePreviewModal();
                        this.props.getEvents();
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
                        this.props.closeProfilePreviewModal();
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
                    onPress: async () => {
                        await this.props.respondToRequest(userId, true)
                        this.props.closeProfilePreviewModal();
                        this.props.getEvents();
                    },
                    style: 'destructive'
                },
            ],
            {cancelable: false},
        );    
    }

    getActionButton(friendStatus, userId){
        if(friendStatus === 'none'){
            return (
                <Button transparent onPress={() => {
                    this.props.sendFriendRequest(userId);
                    this.props.closeProfilePreviewModal();          
                }}>
                    <Text>Send Friend Request</Text>
                </Button>
            )
        }
        else if(friendStatus === 'current'){
            return (
                <Button danger transparent onPress={() => {
                    this.confirmRemoveFriend(userId);
                }}>
                    <Text>Remove Friend</Text>
                </Button>
            )  
        }
        else if(friendStatus === 'outgoingRequest'){
            return (
                <Button warning transparent onPress={() => {
                    this.confirmCancelSentFriendRequest(userId)        
                }}>
                    <Text>Cancel Friend Request</Text>
                </Button>
            )    
        }
        else if(friendStatus === 'incomingRequest'){
            return (
                <Button success transparent onPress={() => {
                    this.confirmFriend(userId)
                }}>
                    <Text>Confirm Friend</Text>
                </Button>
            )    
        }
        else{
            console.log('how sway', friendStatus)
        }
    }

    getFavoriteButton(friendStatus, friendUserId) {

        let isStarred = false;
        const friendIndex = findIndex((this.props.current), (currentFriend) => currentFriend.friendUserId === friendUserId);
        if(friendIndex !== -1){
            isStarred = get(this.props.current[friendIndex], 'starred', false);
        }

        if(friendStatus === 'current'){
            return (
                <Button transparent dark onPress={() => {
                    this.props.updateStarred(!isStarred, friendUserId)
                }}>
                    {
                        (isStarred) ? <Icon name='star' style={styles.starIcon}/> : <Icon name='star-outline' style={styles.starIconOutline}/>
                    }
                </Button>
            )
        }
    }
    
    render() {
        return (
            <BasicModal
                innerContainerStyles={styles.innerContainer}
                isOpen={this.props.isOpen}
                onRequestClose={() => { this.props.onRequestClose() }}
                content={
                    <View style={styles.center}>
                        <Image
                            style={styles.profile}
                            source={{uri: get(this.props, 'profile.profilePic', '')}} 
                        />
                        <View>
                            {this.getFavoriteButton(this.props.friendStatus, get(this.props, 'profile.userId', ''))}
                        </View>
                        <Text style={{marginBottom: 10}}>
                            {get(this.props, 'profile.displayName', '')}
                        </Text>
                        <Text style={{marginBottom: 10}}>
                            {get(this.props, 'profile.username', '')}
                        </Text>
                        <View style={styles.buttonBar}>
                            <Button dark transparent onPress={() => { this.props.onRequestClose() }}>
                                <Text>Close</Text>
                            </Button>
                            {this.getActionButton(this.props.friendStatus, get(this.props, 'profile.userId', ''))}
                        </View>
                    </View>
                }
            />
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        current: friendsSelector(state).current,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePreviewModal);
