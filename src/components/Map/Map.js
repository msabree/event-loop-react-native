import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import {Container} from 'native-base';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import get from 'lodash/get';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

class Map extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.events.length > 0) {
      this.state = {
        region: {
          latitude: this.props.events[this.props.events.length - 1].location
            .geometry.location.lat,
          longitude: this.props.events[this.props.events.length - 1].location
            .geometry.location.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
      };
    }
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={this.state ? this.state.region : {}}>
              {this.props.events.map(event => (
                <Marker
                  key={event.id}
                  coordinate={{
                    latitude: get(event, 'location.geometry.location.lat', ''),
                    longitude: get(event, 'location.geometry.location.lng', ''),
                  }}
                  title={event.title}
                  description={`${event.details} - Starts: ${moment(
                    event.startDatetime,
                  ).fromNow()}`}
                />
              ))}
            </MapView>
          </View>
        </Container>
      </React.Fragment>
    );
  }
}

Map.propTypes = {
  events: PropTypes.shape(),
};

Map.defaultProps = {
  events: {},
};

export default Map;
