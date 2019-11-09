import get from 'lodash/get';
import {connect} from 'react-redux';
import eventsSelector from '../../selectors/events';
import Map from './component';

function mapDispatchToProps() {
  return {};
}

function mapStateToProps(state) {
  const events = eventsSelector(state).eventList;
  const region = {
    latitude: 33.749, // ATL
    longitude: -84.388, // ATL
    latitudeDelta: 0.4,
    longitudeDelta: 0.4,
  };

  if (events.length > 0) {
    region.latitude = get(events[0], 'location.geometry.location.lat', 33.749);
    // eslint-disable-next-line prettier/prettier
    region.longitude = get(events[0], 'location.geometry.location.lng', -84.388);
  }

  return {
    region,
    events,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map);
