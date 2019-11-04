import React from 'react';
import {Modal, View} from 'react-native';
import {List, ListItem, Text, Left, Body, Button} from 'native-base';
import startCase from 'lodash/startCase';
import UserProfilePicture from '../UserProfilePicture';

import styles from './styles';

export default class ViewGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.componentState.modalVisible}>
        <View style={styles.wrapper}>
          <Text style={styles.headerText}>
            {startCase(this.props.componentState.title)}
          </Text>
          <List>
            {this.props.componentState.friends.map((friend, i) => (
              <ListItem thumbnail key={i} style={styles.listItem}>
                <Left>
                  <UserProfilePicture
                    profile={{
                      userId: friend.friendUserId,
                      profilePic: friend._profilePic,
                    }}
                  />
                </Left>
                <Body>
                  <Text>{friend._displayName}</Text>
                </Body>
              </ListItem>
            ))}
          </List>
          <View style={styles.buttonBar}>
            <Button
              dark
              bordered
              onPress={() => {
                this.props.hideModal();
                this.props.navigation.navigate('CreateGroup', {
                  group: this.props.componentState.selectedGroup,
                  groupId: this.props.componentState.groupId,
                  friends: this.props.componentState.friends,
                });
              }}>
              <Text>Add Friends</Text>
            </Button>
            <Button
              dark
              bordered
              onPress={() => {
                this.props.hideModal();
              }}>
              <Text>Close</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}
