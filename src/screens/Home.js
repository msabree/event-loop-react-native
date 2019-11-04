/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Platform, FlatList} from 'react-native';
import {
  Text,
  Card,
  CardItem,
  Icon,
  Fab,
  Container,
  Picker,
  Left,
  Right,
  Button,
} from 'native-base';
import {firebase} from '@react-native-firebase/analytics';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../actions';
import EventCard from '../components/EventCard/EventCard';
import Loading from '../components/Loading';
import MapView from '../components/Map/Map';
import eventsSelector from '../selectors/events';
import userSelector from '../selectors/users';
import authenticationSelector from '../selectors/authentication';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  headerProfilePic: {
    width: 60,
    height: 60,
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'list',
    };
  }

  componentDidMount() {
    if (this.props.sessionToken !== '' && this.props.sessionToken !== null) {
      this.props.getEvents();

      // Google Analytics
      // Shows when a user hits the home page
      Promise.all([
        firebase.analytics().setUserId(this.props.loggedInUserId),
        firebase.analytics().logEvent('home_page_view', {}),
      ]);
    }
  }

  getBannerUnitId() {
    if (__DEV__) {
      return 'ca-app-pub-3940256099942544/6300978111';
    } else if (Platform.OS === 'android') {
      return 'ca-app-pub-9804482407199604/7027103890';
    }
    return 'ca-app-pub-9804482407199604/4029760684';
  }

  getListView() {
    if (this.props.eventList === null) {
      return <Loading message="Loading latest updates... Please wait." />;
    } else if (this.props.eventList.length > 0) {
      return (
        <Container>
          <FlatList
            data={this.props.eventList.sort(function(a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(a.startDatetime) - new Date(b.startDatetime);
            })}
            onRefresh={() => {
              this.props.getEvents(true);
            }}
            refreshing={this.props.fetchingNew}
            renderItem={({item}) => {
              const isCreator = item.userId === this.props.loggedInUserId;
              return (
                <EventCard
                  isCreator={isCreator}
                  item={item}
                  deleteEvent={this.props.deleteEvent}
                />
              );
            }}
            keyExtractor={item => item.eventId}
          />
        </Container>
      );
    }
    return (
      <Card transparent style={styles.center}>
        <CardItem transparent header>
          <Text>Nothing to show. Try adjusting your filter.</Text>
        </CardItem>
      </Card>
    );
  }

  getMapView() {
    return <MapView />;
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <Container>
            <Card transparent style={styles.mainHeader}>
              <CardItem transparent>
                <Left>
                  <Button
                    transparent
                    dark
                    onPress={() => {
                      const view = this.state.view;
                      if (view === 'list') {
                        this.setState({
                          view: 'map',
                        });
                      } else {
                        this.setState({
                          view: 'list',
                        });
                      }
                    }}>
                    <Text style={{fontSize: 18}}>
                      {this.state.view === 'list' ? 'Map' : 'List'}
                    </Text>
                  </Button>
                </Left>
                <Right>
                  <Picker
                    mode="dropdown"
                    iosHeader="Filter"
                    iosIcon={<Icon name="md-funnel" dark />}
                    style={{width: undefined}}
                    selectedValue={this.props.eventsFilter || 'upcoming'}
                    onValueChange={filter => {
                      this.props.changeEventsFilter(filter);
                    }}>
                    <Picker.Item label="Upcoming" value="upcoming" />
                    <Picker.Item label="Past" value="past" />
                    <Picker.Item label="Created By Me" value="created" />
                    <Picker.Item label="Joined By Me" value="joined" />
                  </Picker>
                </Right>
              </CardItem>
            </Card>
            {this.state.view === 'list'
              ? this.getListView()
              : this.getMapView()}
          </Container>
          <Fab
            active={false}
            direction="left"
            containerStyle={{}}
            style={{backgroundColor: 'orange'}}
            position="bottomRight"
            onPress={() => {
              this.props.navigation.navigate('CreateEvent');
            }}>
            <Icon name="add" />
          </Fab>
        </Container>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    sessionToken: authenticationSelector(state).sessionToken,
    eventList: eventsSelector(state).eventList,
    fetchingNew: eventsSelector(state).fetchingNew,
    sliderIndex: eventsSelector(state).sliderIndex,
    eventsFilter: eventsSelector(state).eventsFilter,
    loggedInUserId: userSelector(state).loggedInUserId,
    loggedInDisplayName: userSelector(state).loggedInDisplayName,
    loggedInProfilePic: userSelector(state).loggedInProfilePic,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
