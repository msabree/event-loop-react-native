import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Container} from 'native-base';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import get from 'lodash/get';
import moment from 'moment';

import styles from './styles';

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
            }}
            title={event.title}
            description={`${event.title} - ${
              new Date() > new Date(event.endDatetime) ? 'Ended' : 'Ends'
            } ${moment(event.endDatetime).fromNow()}`}
          />
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
