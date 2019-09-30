import get from 'lodash/get';
import React from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { Button, Text } from 'native-base';

import BasicModal from './BasicModal';

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
});

export default class ProfilePreviewModal extends React.Component {
    
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

    getActionButton(friendStatus, userId){
        if(friendStatus === 'none'){
            return (
                <Button transparent onPress={() => {
                                
                }}>
                    <Text>Add Friend</Text>
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
                                
                }}>
                    <Text>Cancel Friend Request</Text>
                </Button>
            )    
        }
        else if(friendStatus === 'incomingRequest'){
            return (
                <Button warning transparent onPress={() => {
                                
                }}>
                    <Text>Confirm Friend Request</Text>
                </Button>
            )    
        }
        else{
            console.log('how sway', friendStatus)
        }
    }
    
    render() {
        return (
            <BasicModal
                isOpen={this.props.isOpen}
                onRequestClose={() => { this.props.onRequestClose() }}
                content={
                    <View style={styles.center}>
                        <Image
                            style={styles.profile}  
                            source={{uri: get(this.props, 'profile.profilePic', '')}} 
                        />
                        <Text style={{marginBottom: 10}}>
                            {get(this.props, 'profile.username', '')}
                        </Text>
                        <View style={styles.buttonBar}>
                            <Button dark transparent onPress={() => { this.props.onRequestClose() }}>
                                <Text>Cancel</Text>
                            </Button>
                            {this.getActionButton(this.props.friendStatus, get(this.props, 'profile.userId', ''))}
                        </View>
                    </View>
                }
            />
        )
    }
}
