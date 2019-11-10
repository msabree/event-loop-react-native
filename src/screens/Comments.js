import React from 'react';
import {StyleSheet, Linking, TouchableOpacity} from 'react-native';
import {
  Content,
  List,
  ListItem,
  Input,
  Text,
  Item,
  Button,
  Container,
  ActionSheet,
} from 'native-base';
import Hyperlink from 'react-native-hyperlink';
import moment from 'moment';
import noop from 'lodash/noop';

import UserProfilePicture from '../components/UserProfilePicture';

import eventsSelector from '../selectors/events';
import usersSelector from '../selectors/users';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../actions';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
  },
  listItem: {
    flexDirection: 'column',
  },
  contentContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  contentContainer2: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  comment: {
    minWidth: 250,
    maxWidth: 290,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: 'maroon',
    color: '#fff',
    borderRadius: 10,
  },
  comment2: {
    minWidth: 250,
    maxWidth: 290,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: 'grey',
    color: '#fff',
    borderRadius: 10,
  },
  text: {
    color: 'grey',
    fontSize: 12,
  },
  link: {
    color: '#21579E',
    textDecorationLine: 'underline',
  },
  linkStyle2: {
    color: '#86BAFD',
    textDecorationLine: 'underline',
  },
});

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
    };
  }

  componentDidMount() {
    const {event} = this.props.navigation.state.params;

    this.props.getComments(event.eventId);
  }

  componentWillUnmount() {
    this.props.clearComments();
  }

  getChatListItem(commentObject) {
    if (commentObject.isCreator === true) {
      return (
        <ListItem
          style={styles.listItem}
          key={commentObject.commentId}
          onLongPress={
            commentObject.userId !== this.props.loggedInUserId
              ? noop()
              : () =>
                  ActionSheet.show(
                    {
                      options: ['Delete', 'Cancel'],
                      cancelButtonIndex: 2,
                      destructiveButtonIndex: 0,
                      title: 'Comments',
                    },
                    buttonIndex => {
                      if (buttonIndex === 0) {
                        this.props.deleteComment(commentObject.commentId);
                      } else {
                        ActionSheet.hide();
                      }
                    },
                  )
          }>
          <Content contentContainerStyle={styles.contentContainer}>
            <TouchableOpacity
              onPress={() => {
                if (commentObject.userId === this.props.loggedInUserId) {
                  this.props.navigation.navigate('Profile');
                } else {
                  this.props.showProfilePreviewModal(commentObject);
                }
              }}>
              <UserProfilePicture
                profile={commentObject}
                style={styles.thumbnail}
              />
            </TouchableOpacity>
            <Hyperlink
              linkStyle={styles.link}
              onPress={url => Linking.openURL(url)}>
              <Text style={styles.comment}>{commentObject.comment}</Text>
            </Hyperlink>
          </Content>
          <Content>
            <Text style={styles.text}>
              {commentObject.displayName === ''
                ? commentObject.username
                : commentObject.displayName}
            </Text>
          </Content>
          <Content>
            <Text style={styles.text}>
              {moment(commentObject.datetimePosted).format('MMM Do h:mm a')}
            </Text>
          </Content>
        </ListItem>
      );
    }
    return (
      <ListItem
        style={styles.listItem}
        key={commentObject.commentId}
        onLongPress={
          commentObject.userId !== this.props.loggedInUserId
            ? noop()
            : () =>
                ActionSheet.show(
                  {
                    options: ['Delete', 'Cancel'],
                    cancelButtonIndex: 2,
                    destructiveButtonIndex: 0,
                    title: 'Comments',
                  },
                  buttonIndex => {
                    if (buttonIndex === 0) {
                      this.props.deleteComment(commentObject.commentId);
                    } else {
                      ActionSheet.hide();
                    }
                  },
                )
        }>
        <Content contentContainerStyle={styles.contentContainer2}>
          <Hyperlink
            linkStyle={styles.linkStyle2}
            onPress={url => Linking.openURL(url)}>
            <Text style={styles.comment2}>{commentObject.comment}</Text>
          </Hyperlink>
          <TouchableOpacity
            onPress={() => {
              if (commentObject.userId === this.props.loggedInUserId) {
                this.props.navigation.navigate('Profile');
              } else {
                this.props.showProfilePreviewModal(commentObject);
              }
            }}>
            <UserProfilePicture
              profile={commentObject}
              style={styles.thumbnail}
            />
          </TouchableOpacity>
        </Content>
        <Content>
          <Text style={styles.text}>
            {commentObject.displayName === ''
              ? commentObject.username
              : commentObject.displayName}
          </Text>
        </Content>
        <Content>
          <Text style={styles.text}>
            {moment(commentObject.datetimePosted).format('MMM Do h:mm a')}
          </Text>
        </Content>
      </ListItem>
    );
  }

  render() {
    const {event, isCreator} = this.props.navigation.state.params;

    return (
      <Content>
        <List>
          {this.props.comments.map(comment => {
            return this.getChatListItem(comment);
          })}
        </List>
        <Container>
          <Item regular>
            <Input
              value={this.state.comment}
              placeholder="Add a comment"
              onChangeText={text => {
                this.setState({
                  comment: text,
                });
              }}
            />
            <Button
              info
              onPress={() => {
                this.props.postComment(
                  event.eventId,
                  this.state.comment,
                  isCreator,
                );
                this.setState({
                  comment: '',
                });
              }}>
              <Text>Post</Text>
            </Button>
          </Item>
        </Container>
      </Content>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    comments: eventsSelector(state).comments,
    loggedInUserId: usersSelector(state).loggedInUserId,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Comments);
