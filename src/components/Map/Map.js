import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Container} from 'native-base';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

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

class Explorer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Container>
          <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            />
          </View>
        </Container>
      </React.Fragment>
    );
  }
}

Explorer.propTypes = {};

Explorer.defaultProps = {};

export default Explorer;
