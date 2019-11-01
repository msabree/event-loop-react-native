import React from 'react';
import {StyleSheet, Modal, View} from 'react-native';
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Fab,
  Icon,
  Left,
  Thumbnail,
  Body,
  Right,
  Button,
} from 'native-base';

import friendsSelector from '../selectors/friends';
import groupsSelector from '../selectors/groups';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../actions';

import UserProfilePicture from '../components/UserProfilePicture';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      modalVisible: false,
      title: '',
      friends: [],
      selectedGroup: {},
      groupId: '',
    };
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };

  groupDetails = group => {
    const friends = group.members.map(memberId => {
      return this.props.currentFriends.find(x => x.friendUserId === memberId);
    });
    this.setState({title: group.title});
    this.setState({modalVisible: true});
    this.setState({friends: friends});
    this.setState({selectedGroup: group});
    this.setState({groupId: group.id});
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <Container>
            <Content>
              <List>
                {this.props.groups.groups.map((group, i) => (
                  <ListItem thumbnail key={i}>
                    <Left>
                      <Thumbnail square source={{uri: 'Image URL'}} />
                    </Left>
                    <Body>
                      <Text>{group.title}</Text>
                    </Body>
                    <Right>
                      <Button
                        onPress={() => {
                          this.groupDetails(group);
                        }}
                        transparent>
                        <Text>View</Text>
                      </Button>
                    </Right>
                  </ListItem>
                ))}
              </List>
            </Content>
          </Container>
          <Fab
            active={false}
            direction="left"
            containerStyle={{}}
            style={{backgroundColor: 'orange'}}
            position="bottomRight"
            onPress={() => {
              this.props.navigation.navigate('CreateGroup');
            }}>
            <Icon name="add" />
          </Fab>

          <View style={{marginTop: 22}}>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}>
              <View style={{marginTop: 22}}>
                <View>
                  <Text>{this.state.title}</Text>
                  {this.state.friends.map((friend, i) => (
                    <ListItem thumbnail key={i}>
                      <Left>
                        <UserProfilePicture
                          profile={{
                            userId: friend.friendUserId,
                            profilePic: friend._profilePic,
                          }}
                          style={styles.thumbnail}
                        />
                      </Left>
                      <Body>
                        <Text>{friend._displayName}</Text>
                      </Body>
                    </ListItem>
                  ))}
                  <Button
                    onPress={() => {
                      console.log(this.props.groups.groups);
                      this.setState({modalVisible: false});
                      this.props.navigation.navigate('CreateGroup', {
                        group: this.state.selectedGroup,
                        groupId: this.state.groupId,
                        friends: this.state.friends,
                      });
                    }}>
                    <Text>Add Friends</Text>
                  </Button>
                  <Button
                    onPress={() => {
                      this.setState({modalVisible: false});
                    }}>
                    <Text>Close</Text>
                  </Button>
                </View>
              </View>
            </Modal>
          </View>
        </Container>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    currentFriends: friendsSelector(state).current,
    groups: groupsSelector(state),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Groups);
