import React from 'react';
import PropTypes from 'prop-types';
import {Modal, View} from 'react-native';
import noop from 'lodash/noop';
import {
  List,
  ListItem,
  Text,
  Left,
  Right,
  Icon,
  Body,
  Button,
  Input,
  Item,
} from 'native-base';
import UserProfilePicture from '../UserProfilePicture';
import SelectFriends from '../SelectFriends/SelectFriends';

import styles from './styles';

const ManageGroup = ({
  modalVisible,
  friendsInGroup,
  friendsNotInGroup,
  selectedFriendIds,
  selectedFriendIdsChanged,
  titleChanged,
  groupTitle,
  saveGroup,
  cancel,
  createMode,
}) => (
  <Modal animationType="slide" transparent={false} visible={modalVisible}>
    <View style={styles.wrapper}>
      <Item regular>
        <Input
          onChangeText={title => {
            titleChanged(title);
          }}
          value={groupTitle}
          placeholder={groupTitle === '' ? 'Enter a group name' : groupTitle}
        />
      </Item>
      <SelectFriends
        friends={friendsNotInGroup.map(friend => {
          return {
            name: friend._displayName || friend._username,
            id: friend.friendUserId,
          };
        })}
        selectedItems={selectedFriendIds}
        onSelectedItemsChange={selectedFriendIdsChanged}
      />
      <List>
        {friendsInGroup.map((friend, i) => (
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
              <Text note>{''}</Text>
            </Body>
            <Right>
              <Button
                dark
                transparent
                onPress={() => {
                  console.log('hello');
                }}>
                <Icon name="close" />
              </Button>
            </Right>
          </ListItem>
        ))}
      </List>
      <Button
        style={styles.button}
        success
        bordered
        onPress={() => saveGroup()}>
        <Text>{createMode === true ? 'Save' : 'Update'}</Text>
      </Button>
      {createMode === false && (
        <Button style={styles.button} danger bordered onPress={() => {}}>
          <Text>Delete</Text>
        </Button>
      )}
      <Button style={styles.button} dark bordered onPress={() => cancel()}>
        <Text>Cancel</Text>
      </Button>
    </View>
  </Modal>
);

ManageGroup.propTypes = {
  createMode: PropTypes.bool,
  modalVisible: PropTypes.bool,
  groupTitle: PropTypes.string,
  friendsInGroup: PropTypes.arrayOf(PropTypes.shape),
  friendsNotInGroup: PropTypes.arrayOf(PropTypes.shape),
  selectedFriendIds: PropTypes.arrayOf(PropTypes.string),
  selectedFriendIdsChanged: PropTypes.func.isRequired,
  titleChanged: PropTypes.func.isRequired,
  saveGroup: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

ManageGroup.defaultProps = {
  createMode: false,
  modalVisible: false,
  groupTitle: '',
  friendsInGroup: [],
  friendsNotInGroup: [],
  selectedFriendIds: [],
  selectedFriendIdsChanged: noop,
  titleChanged: noop,
  saveGroup: noop,
  cancel: noop,
};

export default ManageGroup;
