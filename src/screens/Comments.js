import React from 'react';
import { StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Content, List, ListItem, Input, Thumbnail, Text, Item, Button, Container, ActionSheet } from 'native-base';
import Hyperlink from 'react-native-hyperlink';
import moment from 'moment';
import noop from 'lodash/noop'

import eventsSelector from '../selectors/events';
import usersSelector from '../selectors/users';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    // profile: {
    //     width: 100,
    //     height: 100,
    //     borderRadius: 50,
    // },
    noProfile: {
        width: 36,
        height: 36,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey'
    }
});

class Comments extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            comment: '',
            profilePicLoading: {},
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

    getProfilePic(commentObject) {
        const { userId, profilePic } = commentObject;
        const profilePicObj = {uri: profilePic, cache:"default"};
        const defaultPic = require('../images/default_profile_pic.png')
        const picSource = this.state.profilePicLoading[userId] !== false ? defaultPic : profilePicObj
        
        return (
            <Thumbnail 
                small
                onLoadEnd={() => {
                    const picLoading = this.state.profilePicLoading;
                    picLoading[userId] = false;
                    this.setState({
                        profilePicLoading: picLoading
                    })
                }}
                source={picSource} 
            />
        )
    }

    getChatListItem(commentObject) {
        if(commentObject.isCreator === true){
            return (
            <ListItem style={{flexDirection: 'column'}} key={commentObject.commentId}
            onLongPress={(commentObject.userId !== this.props.loggedInUserId) ? noop() : () =>
                ActionSheet.show(
                    {
                        options: ['Delete', 'Cancel'],
                        cancelButtonIndex: 2,
                        destructiveButtonIndex: 0,
                        title: 'Comments'
                    },
                    buttonIndex => {
                        if (buttonIndex === 0) this.props.deleteComment(commentObject.commentId)
                        else ActionSheet.hide() 
                    }
                )}
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
                            {this.getProfilePic(commentObject)}
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
        return (
            <ListItem style={{flexDirection: 'column'}} key={commentObject.commentId}
            onLongPress={(commentObject.userId !== this.props.loggedInUserId) ? noop() : () =>
                ActionSheet.show(
                    {
                        options: ['Delete', 'Cancel'],
                        cancelButtonIndex: 2,
                        destructiveButtonIndex: 0,
                        title: 'Comments'
                    },
                    buttonIndex => {
                        if (buttonIndex === 0) this.props.deleteComment(commentObject.commentId)
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
                        {this.getProfilePic(commentObject)}
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
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);