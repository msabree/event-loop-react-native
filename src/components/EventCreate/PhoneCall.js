import React from 'react';
import {StyleSheet} from 'react-native';
import {Content, CardItem, Item, Textarea, Input, Text} from 'native-base';
import DatePicker from 'react-native-datepicker';
import get from 'lodash/get';
import moment from 'moment';

import formsSelector from '../../selectors/forms';
import eventSelector from '../../selectors/events';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../actions';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    width: '100%',
  },
});

class PhoneCallEvent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const minDateTime = new Date();
    minDateTime.setHours(minDateTime.getHours() + 1); // 1 hour from now
    const maxDateTime = new Date();
    maxDateTime.setHours(minDateTime.getHours() + 6); // 6 hours from now
    return (
      <Content>
        <CardItem transparent>
          <Item regular>
            <Input
              placeholderTextColor={'#5d5d5d80'}
              placeholder={'Enter a title'}
              value={get(this.props, 'phoneCallEvent.title', '')}
              onChangeText={value =>
                this.props.inputChange('phoneCallEvent.title', value)
              }
            />
          </Item>
        </CardItem>
        <CardItem transparent>
          <Textarea
            style={styles.textArea}
            value={get(this.props, 'phoneCallEvent.details', '')}
            rowSpan={2}
            placeholderTextColor={'#5d5d5d80'}
            bordered
            onChangeText={value => {
              this.props.inputChange('phoneCallEvent.details', value);
            }}
            placeholder="Enter details"
          />
        </CardItem>
        <CardItem transparent>
          <Item regular>
            <Input
              placeholderTextColor={'#5d5d5d80'}
              placeholder={'Dial-in Phone Number'}
              value={get(this.props, 'phoneCallEvent.phoneNumber', '')}
              onChangeText={value =>
                this.props.inputChange('phoneCallEvent.phoneNumber', value)
              }
            />
          </Item>
        </CardItem>
        <CardItem transparent>
          <Item regular>
            <Input
              placeholderTextColor={'#5d5d5d80'}
              placeholder={'Dial-in Passcode'}
              value={get(this.props, 'phoneCallEvent.passCode', '')}
              onChangeText={value =>
                this.props.inputChange('phoneCallEvent.passCode', value)
              }
            />
          </Item>
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
                  'phoneCallEvent.startDateTime',
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
                'phoneCallEvent.endDatetime',
                new Date(minDateTime),
              )}
              placeholder={'End time'}
              mode="time"
              format="h:mm a"
              minDate={get(
                this.props,
                'phoneCallEvent.endDatetime',
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
                  'phoneCallEvent.endDatetime',
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
    phoneCallEvent: formsSelector(state).phoneCallEvent,
    newEventCreated: eventSelector(state).newEventCreated,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhoneCallEvent);
