import React from 'react';
import {Modal, View} from 'react-native';
import {
  List,
  ListItem,
  Text,
  Left,
  Body,
  Button,
  Input,
  Item,
} from 'native-base';
import startCase from 'lodash/startCase';
import UserProfilePicture from '../UserProfilePicture';
import SelectFriends from '../SelectFriends/SelectFriends';

import styles from './styles';

export default class ViewGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      selectedItems: [],
    };
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.componentState.modalVisible}>
        <View style={styles.wrapper}>
          <Item regular>
            <Input
              placeholder={
                this.props.componentState.title === ''
                  ? 'Enter a group name'
                  : startCase(this.props.componentState.title)
              }
            />
          </Item>
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
          <SelectFriends
            friends={this.props.componentState.friends.map(friend => {
              return {
                name: friend._displayName || friend._username,
                id: friend.friendUserId,
              };
            })}
            selectedItems={this.state.selectedItems}
            onSelectedItemsChange={this.onSelectedItemsChange.bind(this)}
          />
          <View style={styles.buttonBar}>
            <Button
              dark
              bordered
              onPress={() => {
                this.props.editGroup(
                  this.state.selectedItems,
                  this.props.componentState.groupId,
                );
                this.props.hideModal();
              }}>
              <Text>Save</Text>
            </Button>
            <Button
              dark
              bordered
              onPress={() => {
                this.props.hideModal();
              }}>
              <Text>Cancel</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}
