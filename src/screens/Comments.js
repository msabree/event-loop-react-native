import React from 'react';
import { StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Content, List, ListItem, Input, Thumbnail, Text, Item, Button, Container, ActionSheet } from 'native-base';
import Hyperlink from 'react-native-hyperlink';
import moment from 'moment';

import eventsSelector from '../selectors/events';
import friendsSelector from '../selectors/friends';
import usersSelector from '../selectors/users';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import ProfilePreviewModal from '../components/ProfilePreviewModal';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

class Comments extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            comment: '',
        }
    }

    componentDidMount() {
        const {
            event,
        } = this.props.navigation.state.params;

        this.props.getComments(event.eventId)
    }

    componentWillUnmount() {
        this.props.clearComments();
    }

    getChatListItem(commentObject){
        if(commentObject.isCreator === true){
            if (commentObject.userId === this.props.loggedInUserId){
                return (
                    <ListItem style={{flexDirection: 'column'}} key={commentObject.commentId}
                        onLongPress={() =>
                            ActionSheet.show(
                                {
                                options: ['Edit', 'Delete', 'Cancel'],
                                cancelButtonIndex: 2,
                                destructiveButtonIndex: 1,
                                title: "Action Sheet"
                                },
                                buttonIndex => {
                                if (buttonIndex == 0) this.props.editComment(commentObject.commentId)
                                else if (buttonIndex == 1) this.props.deleteComment(commentObject.commentId)
                                else ActionSheet.hide() 
                                }
                            )
                        } 
                    > 
                        <Content contentContainerStyle={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => {
                                if(commentObject.userId === this.props.loggedInUserId){
                                    this.props.navigation.navigate('Profile');
                                }
                                else{
                                    this.props.showProfilePreviewModal(commentObject);
                                }
                            }}>
                                <Thumbnail small source={{ uri: commentObject.profilePic }} />
                            </TouchableOpacity>
                            <Hyperlink linkStyle={ { color: '#21579E', textDecorationLine: 'underline' } } onPress={ (url) => Linking.openURL(url) }>
                                <Text style={{minWidth: 250, maxWidth: 310, marginLeft: 10, marginRight: 10, padding: 10, backgroundColor: 'orange', color: '#fff', borderRadius: 10, }}>
                                    {commentObject.comment}
                                </Text>
                            </Hyperlink>
                        </Content>
                        <Content>
                            <Text style={{color: 'grey', fontSize: 12}}>
                                {(commentObject.displayName === '') ? commentObject.username : commentObject.displayName}
                            </Text>
                        </Content>
                        <Content>
                            <Text style={{color: 'grey', fontSize: 12}}>{moment(commentObject.datetimePosted).format("MMM Do h:mm a")}</Text>
                        </Content>
                    </ListItem>
                )
            }
            <ListItem style={{flexDirection: 'column'}} key={commentObject.commentId}> 
                <Content contentContainerStyle={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => {
                        if(commentObject.userId === this.props.loggedInUserId){
                            this.props.navigation.navigate('Profile');
                        }
                        else{
                            this.props.showProfilePreviewModal(commentObject);
                        }
                    }}>
                        <Thumbnail small source={{ uri: commentObject.profilePic }} />
                    </TouchableOpacity>
                    <Hyperlink linkStyle={ { color: '#21579E', textDecorationLine: 'underline' } } onPress={ (url) => Linking.openURL(url) }>
                        <Text style={{minWidth: 250, maxWidth: 310, marginLeft: 10, marginRight: 10, padding: 10, backgroundColor: 'orange', color: '#fff', borderRadius: 10, }}>
                            {commentObject.comment}
                        </Text>
                    </Hyperlink>
                </Content>
                <Content>
                    <Text style={{color: 'grey', fontSize: 12}}>
                        {(commentObject.displayName === '') ? commentObject.username : commentObject.displayName}
                    </Text>
                </Content>
                <Content>
                    <Text style={{color: 'grey', fontSize: 12}}>{moment(commentObject.datetimePosted).format("MMM Do h:mm a")}</Text>
                </Content>
            </ListItem>
        }
        if (commentObject.userId === this.props.loggedInUserId){
            return (
                <ListItem style={{flexDirection: 'column'}} key={commentObject.commentId}
                onLongPress={() =>
                    ActionSheet.show(
                    {
                        options: ['Edit', 'Delete', 'Cancel'],
                        cancelButtonIndex: 2,
                        destructiveButtonIndex: 1,
                        title: "Action Sheet"
                    },
                    buttonIndex => {
                        if (buttonIndex == 0) this.props.editComment(commentObject.commentId)
                        else if (buttonIndex == 1) this.props.deleteComment(commentObject.commentId)
                        else ActionSheet.hide() 
                    }
                    )}
                >
                    <Content contentContainerStyle={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                        <Hyperlink linkStyle={ { color: '#86BAFD', textDecorationLine: 'underline' } } onPress={ (url) => Linking.openURL(url) }>
                            <Text style={{minWidth: 250, maxWidth: 310, marginLeft: 10, marginRight: 10, padding: 10, backgroundColor: 'grey', color: '#fff', borderRadius: 10, }}>
                                {commentObject.comment}
                            </Text>
                        </Hyperlink>
                        <TouchableOpacity onPress={() => {
                            if(commentObject.userId === this.props.loggedInUserId){
                                this.props.navigation.navigate('Profile');
                            }
                            else{
                                this.props.showProfilePreviewModal(commentObject);
                            }
                        }}>
                            <Thumbnail small source={{ uri: commentObject.profilePic}} />
                        </TouchableOpacity>
                    </Content>
                    <Content>
                        <Text style={{color: 'grey', fontSize: 12}}>
                            {(commentObject.displayName === '') ? commentObject.username : commentObject.displayName}
                        </Text>
                    </Content>
                    <Content>
                        <Text style={{color: 'grey', fontSize: 12}}>{moment(commentObject.datetimePosted).format("MMM Do h:mm a")}</Text>
                    </Content>
                </ListItem>
            )
        }    
        return (
            <ListItem style={{flexDirection: 'column'}} key={commentObject.commentId}>
                <Content contentContainerStyle={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                    <Hyperlink linkStyle={ { color: '#86BAFD', textDecorationLine: 'underline' } } onPress={ (url) => Linking.openURL(url) }>
                        <Text style={{minWidth: 250, maxWidth: 310, marginLeft: 10, marginRight: 10, padding: 10, backgroundColor: 'grey', color: '#fff', borderRadius: 10, }}>
                            {commentObject.comment}
                        </Text>
                    </Hyperlink>
                    <TouchableOpacity onPress={() => {
                        if(commentObject.userId === this.props.loggedInUserId){
                            this.props.navigation.navigate('Profile');
                        }
                        else{
                            this.props.showProfilePreviewModal(commentObject);
                        }
                    }}>
                        <Thumbnail small source={{ uri: commentObject.profilePic}} />
                    </TouchableOpacity>
                </Content>
                <Content>
                    <Text style={{color: 'grey', fontSize: 12}}>
                        {(commentObject.displayName === '') ? commentObject.username : commentObject.displayName}
                    </Text>
                </Content>
                <Content>
                    <Text style={{color: 'grey', fontSize: 12}}>{moment(commentObject.datetimePosted).format("MMM Do h:mm a")}</Text>
                </Content>
            </ListItem>
        )    
    }

    render() {

        const {
            event,
            isCreator,
        } = this.props.navigation.state.params;

        return (
            <Content>
                <List>
                    {
                        this.props.comments.map((comment) => {
                            return (
                                this.getChatListItem(comment)
                            )
                        })
                    }
                </List>
                <Container>
                    <Item regular>
                        <Input value={this.state.comment} placeholder='Add a comment' onChangeText={(text) => {
                            this.setState({
                                comment: text,
                            })
                        }}/>
                        <Button info onPress={() => { 
                            this.props.postComment(event.eventId, this.state.comment, isCreator);
                            this.setState({
                                comment: '',
                            })
                        }}>
                            <Text>Post</Text>
                        </Button>
                    </Item>
                </Container>
                <ProfilePreviewModal 
                    isOpen={this.props.profilePreviewModalVisible}
                    onRequestClose={this.props.closeProfilePreviewModal}
                    profile={this.props.profileToPreview}
                    friendStatus={this.props.friendStatus}
                    removeFriend={this.props.removeFriend.bind(this)}
                />
            </Content>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        comments: eventsSelector(state).comments,
        loggedInUserId: usersSelector(state).loggedInUserId,
        profilePreviewModalVisible: friendsSelector(state).profilePreviewModalVisible,
        profileToPreview: friendsSelector(state).profileToPreview,
        friendStatus: friendsSelector(state).friendStatus
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);