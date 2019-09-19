import React from 'react';
import { StyleSheet } from 'react-native';
import { Content, List, ListItem, Input, Thumbnail, Text, Item, Button } from 'native-base';
import get from 'lodash/get';
import moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import eventsSelector from '../selectors/events';

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
            comments: [],
        }
    }

    getChatListItem(comment){
        if(get(comment, 'isHost', true) === true){
            return (
                <ListItem style={{flexDirection: 'column'}}>
                    <Content contentContainerStyle={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                        <Thumbnail small source={{ uri: 'https://flaker-images.s3.amazonaws.com/default-profile.png' }} />
                        <Text style={{minWidth: 250, maxWidth: 310, marginLeft: 10, marginRight: 10, padding: 10, backgroundColor: 'orange', color: '#fff', borderRadius: 10, }}>
                            {comment.text}
                        </Text>
                    </Content>
                    <Content>
                        <Text style={{color: 'grey', fontSize: 12}}>{moment(new Date()).format("MMM Do h:mm a")}</Text>
                    </Content>
                </ListItem>
            )
        }
        return (
            <ListItem style={{flexDirection: 'column'}}>
                <Content contentContainerStyle={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                    <Text style={{minWidth: 250, maxWidth: 310, marginLeft: 10, marginRight: 10, padding: 10, backgroundColor: 'grey', color: '#fff', borderRadius: 10, }}>
                        {comment.text}
                    </Text>
                    <Thumbnail small source={{ uri: 'https://flaker-images.s3.amazonaws.com/default-profile.png'}} />
                </Content>
                <Content>
                    <Text style={{color: 'grey', fontSize: 12}}>{moment(new Date()).format("MMM Do h:mm a")}</Text>
                </Content>
            </ListItem>
        )
    }

    render() {

        const {
            event,
        } = this.props.navigation.state.params;

        return (
            <Content>
                <List>
                    {
                        this.state.comments.map((comment) => {
                            return (
                                this.getChatListItem(comment)
                            )
                        })
                    }
                </List>
                <Content>
                    <Item regular>
                        <Input value={this.state.comment} placeholder='Add a comment' onChangeText={(text) => {
                            this.setState({
                                comment: text,
                            })
                        }}/>
                        <Button info onPress={() => { 
                            this.props.postComment(event.eventId, this.state.comment);
                            const comments =  this.state.comments;
                            comments.push({
                                isHost: true,
                                text: this.state.comment,
                            })
                            comments.push({
                                isHost: false,
                                text: this.state.comment,
                            })
                            this.setState({
                                comment: '',
                                comments,
                            })
                        }}>
                            <Text>Post</Text>
                        </Button>
                    </Item>
                </Content>
            </Content>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {}    
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);