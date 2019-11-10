import React from 'react';
import PropTypes from 'prop-types';
import {View, Linking, Platform} from 'react-native';
import {Container, Text, H3} from 'native-base';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import get from 'lodash/get';
import moment from 'moment';

import UserProfilePicture from '../UserProfilePicture';
import styles from './styles';

const openMaps = (label, lat, lng) => {
  const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
  const latLng = `${lat},${lng}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });
  Linking.openURL(url);
};

const Map = ({events, region}) => (
  <Container>
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={region}>
        {events.map(event => (
          <Marker
            key={event.eventId}
            coordinate={{
              latitude: get(event, 'location.geometry.location.lat', ''),
              longitude: get(event, 'location.geometry.location.lng', ''),
            }}>
            <Callout
              onPress={() => {
                if (event.location) {
                  openMaps(
                    event.location.name,
                    event.location.geometry.location.lat,
                    event.location.geometry.location.lng,
                  );
                }
              }}>
              <View style={{maxWidth: 300}}>
                <UserProfilePicture
                  profile={event.associatedUserProfile}
                  style={{}}
                />
                <H3>{event.title}</H3>
                <Text>{event.details}</Text>
                {event.location && <Text>{event.location.name}</Text>}
                <Text>{`${
                  new Date() > new Date(event.endDatetime) ? 'Ended' : 'Ends'
                } ${moment(event.endDatetime).fromNow()}`}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  </Container>
);

Map.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape()),
  region: PropTypes.shape(),
};

Map.defaultProps = {
  events: [],
  region: {
    latitude: '',
    longitude: '',
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  },
};

export default Map;
