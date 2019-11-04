import React from 'react';
import PropTypes from 'prop-types';
import Hyperlink from 'react-native-hyperlink';
import moment from 'moment';
import get from 'lodash/get';
import noop from 'lodash/noop';
import {Text, Card, CardItem, Button, Icon, Body, H3, Left} from 'native-base';
import {
  Linking,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import UserProfilePicture from '../UserProfilePicture';

import styles from './styles';

const GOOGLE_API_KEY = 'AIzaSyDDDudjqF3i_dxvXGTHn7ZOK_P6334ezM4';

const EventCard = ({
  isCreator,
  item,
  deleteEvent,
  navigation,
  showProfilePreviewModal,
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

  const openMaps = (label, lat, lng) => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };

  const getNavigationButton = () => {
    if (isCreator === false) {
      return (
        <Button
          transparent
          dark
          small
          iconLeft
          onPress={() => {
            openMaps(
              item.location.name,
              item.location.geometry.location.lat,
              item.location.geometry.location.lng,
            );
          }}>
          <Icon name="navigate" />
          <Text style={styles.locationName}>{item.location.name}</Text>
        </Button>
      );
    }
  };

  // Fallback to a static map image if no photo references available
  const getPlaceImage = itemLocation => {
    if (itemLocation === null) {
      return;
    }
    const imageWidth = Math.round(Dimensions.get('window').width * 0.9);
    const imageHeight = Math.round(imageWidth / 2);
    const photos = get(itemLocation, 'photos', []);
    if (photos.length === 0) {
      return (
        <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${
              itemLocation.formatted_address
            }&zoom=18&size=${imageWidth}x${imageHeight}&maptype=roadmap&key=${GOOGLE_API_KEY}`,
          }}
          style={styles.mapImage}
        />
      );
    }
    return (
      <Image
        source={{
          uri: `https://maps.googleapis.com/maps/api/place/photo?photoreference=${
            photos[0].photo_reference
          }&maxheight=${photos[0].height}&maxwidth=${
            photos[0].width
          }&key=${GOOGLE_API_KEY}`,
        }}
        style={styles.locationImage}
      />
    );
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
        <Body>{getPlaceImage(item.location)}</Body>
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
          <Text note style={styles.date}>{`${moment(item.startDatetime).format(
            'MMM Do h:mm a',
          )} - ${moment(item.endDatetime).format('MMM Do h:mm a')}`}</Text>
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
            navigation.navigate('Comments', {
              event: item,
              isCreator,
            });
          }}>
          <Icon name="chatboxes" />
          <Text>{get(item, 'commentCount', 0)}</Text>
        </Button>
        <Button
          transparent
          dark
          small
          iconLeft
          onPress={() => {
            navigation.navigate('GuestList', {
              event: item,
              isCreator,
            });
          }}>
          <Icon name="people" />
          <Text>{get(item, 'guestListCount', 0)}</Text>
        </Button>
        {getNavigationButton(isCreator, item)}
        {getFooter(isCreator, item)}
      </CardItem>
    </Card>
  );
};

EventCard.propTypes = {
  isCreator: PropTypes.bool.isRequired,
  item: PropTypes.shape().isRequired,
  deleteEvent: PropTypes.func.isRequired,
  showProfilePreviewModal: PropTypes.func.isRequired,
  navigation: PropTypes.shape().isRequired,
};

EventCard.defaultProps = {
  isCreator: false,
  item: {},
  deleteEvent: noop,
  showProfilePreviewModal: noop,
  navigation: {},
};

export default EventCard;
