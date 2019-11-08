import React from 'react';
import {StyleSheet} from 'react-native';
import {Content, CardItem, Item, Textarea, Input, Text} from 'native-base';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import DatePicker from 'react-native-datepicker';
import get from 'lodash/get';
import set from 'lodash/set';
import moment from 'moment';

import formsSelector from '../../selectors/forms';
import eventSelector from '../../selectors/events';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../actions';

const GOOGLE_API_KEY = 'AIzaSyDDDudjqF3i_dxvXGTHn7ZOK_P6334ezM4';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    width: '100%',
  },
});

class PhysicalLocationEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listViewDisplayed: true,
    };
  }

  render() {
    const minDateTime = new Date();
    minDateTime.setHours(minDateTime.getHours() + 1); // 1 hour from now
    const maxDateTime = new Date();
    maxDateTime.setHours(minDateTime.getHours() + 6); // 6 hours from now
    return (
      <Content>
        <CardItem transparent style={{marginBottom: 20}}>
          <Item regular>
            <Input
              placeholderTextColor={'#5d5d5d80'}
              placeholder={`Enter a title`}
              value={get(this.props, 'physicalLocationEvent.title', '')}
              onChangeText={value =>
                this.props.inputChange('physicalLocationEvent.title', value)
              }
            />
          </Item>
        </CardItem>
        <CardItem transparent style={{marginBottom: 20}}>
          <Item regular>
            <GooglePlacesAutocomplete
              placeholder={
                get(this.props, 'physicalLocationEvent.location.name') ||
                'Search for address or location'
              }
              minLength={2}
              autoFocus={false}
              returnKeyType={'default'}
              fetchDetails={true}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: GOOGLE_API_KEY, // rotate in release and hide
                language: 'en', // language of the results
                //types: 'establishment', // default is 'all' types
              }}
              listViewDisplayed={this.state.listViewDisplayed}
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                this.setState(
                  {
                    listViewDisplayed: false,
                  },
                  () => {
                    this.props.inputChange(
                      'physicalLocationEvent.location',
                      details,
                    );
                  },
                );
              }}
              styles={{
                textInputContainer: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                },
                textInput: {
                  marginLeft: 0,
                  marginRight: 0,
                  height: 38,
                  color: '#5d5d5d',
                  fontSize: 16,
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
              }}
              currentLocation={false}
            />
          </Item>
        </CardItem>
        <CardItem transparent style={{marginBottom: 20}}>
          <Textarea
            style={styles.textArea}
            value={get(this.props, 'physicalLocationEvent.details', '')}
            rowSpan={2}
            bordered
            onChangeText={value => {
              this.props.inputChange('physicalLocationEvent.details', value);
            }}
            placeholder="Let your friends know the specifics about what's going on."
          />
        </CardItem>
        <CardItem transparent>
          <Text>Happening Now</Text>
        </CardItem>
        <CardItem transparent style={{marginBottom: 20}}>
          <Item regular>
            <DatePicker
              disabled={true}
              style={{width: 200}}
              date={new Date()}
              placeholder={'Start time'}
              mode="time"
              format="h:mm a"
              minDate={new Date()} // now!
              maxDate={new Date()} // now!
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={time => {
                this.props.inputChange(
                  'physicalLocationEvent.startDateTime',
                  new Date(),
                );
              }}
            />
          </Item>
        </CardItem>
        <CardItem transparent>
          <Text>End time</Text>
        </CardItem>
        <CardItem transparent style={{marginBottom: 20}}>
          <Item regular>
            <DatePicker
              style={{width: 200}}
              date={get(
                this.props,
                'physicalLocationEvent.endDatetime',
                new Date(minDateTime),
              )}
              placeholder={'End time'}
              mode="time"
              format="h:mm a"
              minDate={get(
                this.props,
                'physicalLocationEvent.startDatetime',
                new Date(minDateTime),
              )}
              maxDate={new Date(maxDateTime)}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={time => {
                this.props.inputChange(
                  'physicalLocationEvent.endDatetime',
                  new Date(moment(time, 'h:mm a').format()),
                );
              }}
            />
          </Item>
        </CardItem>
        <CardItem transparent>
          <Text note>Posts are viewable for up to six hours.</Text>
        </CardItem>
      </Content>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    physicalLocationEvent: formsSelector(state).physicalLocationEvent,
    newEventCreated: eventSelector(state).newEventCreated,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhysicalLocationEvent);
