import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import { Content, List, ListItem, Input, Thumbnail, Text, Item, Button } from 'native-base';
import Hyperlink from 'react-native-hyperlink';
import get from 'lodash/get';
import moment from 'moment';

import eventsSelector from '../selectors/events';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

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

    getChatListItem(commentObject, isCreator){
        if(isCreator === true){
            return (
                <ListItem style={{flexDirection: 'column'}} key={commentObject.commentId}>
                    <Content contentContainerStyle={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                        <Thumbnail small source={{ uri: 'https://flaker-images.s3.amazonaws.com/default-profile.png' }} />
                        <Hyperlink linkStyle={ { color: '#606aa1' } } onPress={ (url) => Linking.openURL(url) }>
                            <Text style={{minWidth: 250, maxWidth: 310, marginLeft: 10, marginRight: 10, padding: 10, backgroundColor: 'orange', color: '#fff', borderRadius: 10, }}>
                                {commentObject.comment}
                            </Text>
                        </Hyperlink>
                    </Content>
                    <Content>
                        <Text style={{color: 'grey', fontSize: 12}}>{moment(new Date()).format("MMM Do h:mm a")}</Text>
                    </Content>
                </ListItem>
            )
        }
        return (
            <ListItem style={{flexDirection: 'column'}} key={commentObject.commentId}>
                <Content contentContainerStyle={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                    <Hyperlink linkStyle={ { color: '#606aa1' } } onPress={ (url) => Linking.openURL(url) }>
                        <Text style={{minWidth: 250, maxWidth: 310, marginLeft: 10, marginRight: 10, padding: 10, backgroundColor: 'grey', color: '#fff', borderRadius: 10, }}>
                            {commentObject.comment}
                        </Text>
                    </Hyperlink>
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
            isCreator,
        } = this.props.navigation.state.params;

        return (
            <Content>
                <List>
                    {
                        this.props.comments.map((comment) => {
                            return (
                                this.getChatListItem(comment, isCreator)
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
                            this.props.postComment(event.eventId, this.state.comment, isCreator);
                            this.setState({
                                comment: '',
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
    return {
        comments: eventsSelector(state).comments,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);