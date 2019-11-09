import React from 'react';
import PropTypes from 'prop-types';
import Hyperlink from 'react-native-hyperlink';
import moment from 'moment';
import get from 'lodash/get';
import noop from 'lodash/noop';
import {
  Text,
  Card,
  CardItem,
  Button,
  Icon,
  Body,
  H3,
  Left,
  Toast,
} from 'native-base';
import {Linking, TouchableOpacity, Alert, Clipboard} from 'react-native';
import UserProfilePicture from '../UserProfilePicture';

import styles from './styles';

const PhoneCall = ({
  isCreator,
  item,
  deleteEvent,
  showProfilePreviewModal,
  navigation,
}) => {
  const getHeader = () => {
    if (isCreator === false) {
      return (
        <CardItem>
          <Left>
            <TouchableOpacity
              onPress={() => {
                showProfilePreviewModal(item.associatedUserProfile, true);
              }}>
              <UserProfilePicture
                profile={item.associatedUserProfile}
                style={styles.headerProfilePic}
              />
            </TouchableOpacity>
            <Body>
              <Text note>
                Host:{' '}
                {item.associatedUserProfile.displayName ||
                  item.associatedUserProfile.username}
              </Text>
            </Body>
          </Left>
        </CardItem>
      );
    }
  };

  const confirmDeleteEvent = () => {
    Alert.alert(
      'Delete Event',
      'This event has ended. Would you like to delete it?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            deleteEvent(item);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const getFooter = () => {
    if (isCreator === true && new Date() <= new Date(item.endDatetime)) {
      return (
        <Button
          transparent
          small
          dark
          iconLeft
          onPress={() => {
            navigation.navigate('CreateEvent', {
              existingEvent: item,
            });
          }}>
          <Icon name="create" />
          <Text>Edit</Text>
        </Button>
      );
    } else if (isCreator === true && new Date() > new Date(item.endDatetime)) {
      return (
        <Button
          transparent
          small
          danger
          iconLeft
          onPress={() => {
            confirmDeleteEvent(item);
          }}>
          <Icon name="trash" />
          <Text>Delete</Text>
        </Button>
      );
    }
  };

  const getEventEndedMessage = endDatetime => {
    if (new Date() > new Date(endDatetime)) {
      return (
        <Text note style={styles.endMessage}>
          {'This event has ended.'}
        </Text>
      );
    }
  };

  return (
    <Card style={styles.center}>
      {getHeader(isCreator, item)}
      <CardItem>
        <Body>
          <Text>
            <Icon name="call" /> Conference Call
          </Text>
        </Body>
      </CardItem>
      <CardItem>
        <Body>
          <H3 style={styles.title}>{item.title}</H3>
          <Hyperlink
            linkStyle={styles.link}
            onPress={url => Linking.openURL(url)}>
            <Text note style={styles.details}>
              {item.details || ''}
            </Text>
          </Hyperlink>
          <Text note style={styles.date}>
            {`${
              new Date() > new Date(item.endDatetime) ? 'Ended' : 'Ends'
            } ${moment(item.endDatetime).fromNow()}`}
          </Text>
          {getEventEndedMessage(item.endDatetime)}
        </Body>
      </CardItem>
      <CardItem style={styles.buttons}>
        <Button
          transparent
          dark
          small
          iconLeft
          onPress={() => {
            Linking.openURL(`tel:${get(item, 'phoneNumber', '#')}`);
          }}>
          <Icon name="call" />
          <Text>{get(item, 'phoneNumber', '#')}</Text>
        </Button>
        <Button
          transparent
          dark
          small
          iconLeft
          onPress={() => {
            Clipboard.setString(get(item, 'passCode', ''));
            Toast.show({
              text: 'Copied to clipboard',
              buttonText: 'Close',
              type: 'warning',
              duration: 3000,
            });
          }}>
          <Icon name="copy" />
          <Text>{get(item, 'passCode', 'No passcode')}</Text>
        </Button>
        {getFooter(isCreator, item)}
      </CardItem>
    </Card>
  );
};

PhoneCall.propTypes = {
  isCreator: PropTypes.bool.isRequired,
  item: PropTypes.shape().isRequired,
  deleteEvent: PropTypes.func.isRequired,
  showProfilePreviewModal: PropTypes.func.isRequired,
  navigation: PropTypes.shape().isRequired,
};

PhoneCall.defaultProps = {
  isCreator: false,
  item: {},
  deleteEvent: noop,
  showProfilePreviewModal: noop,
  navigation: {},
};

export default PhoneCall;
