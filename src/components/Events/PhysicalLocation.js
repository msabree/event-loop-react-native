import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Content, Card, CardItem, Item, Textarea, Button, Input, Text, Picker, Icon } from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DatePicker from 'react-native-datepicker';
import get from 'lodash/get';
import moment from 'moment';

import formsSelector from '../../selectors/forms';
import eventSelector from '../../selectors/events';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../actions';

const GOOGLE_API_KEY = 'AIzaSyDDDudjqF3i_dxvXGTHn7ZOK_P6334ezM4';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textArea: {
        width: '100%'
    },
});

class PhysicalLocationEvent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            listViewDisplayed: true,
        }
    }

    render() {
        return (
            <Content>
                <CardItem transparent>
                    <Item regular>
                        <Input
                            placeholderTextColor={'#5d5d5d80'} 
                            placeholder={`What are you about to do?`}
                            value={get(this.props, 'event.title', '')}
                            onChangeText={(value) => this.props.inputChange('event.title', value)}
                        />
                    </Item>
                </CardItem>
                <CardItem transparent>
                    <Item regular>
                        <GooglePlacesAutocomplete
                            placeholder={get(this.props, 'event.location.name') || 'Where will you be?'}
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
                            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                this.setState({
                                    listViewDisplayed: false,
                                }, () => {
                                    this.props.inputChange('event.location', details);
                                })
                            }}
                            styles={{
                                textInputContainer: {
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0
                                },
                                textInput: {
                                    marginLeft: 0,
                                    marginRight: 0,
                                    height: 38,
                                    color: '#5d5d5d',
                                    fontSize: 16
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb'
                                },
                            }}
                            currentLocation={false}
                        />
                    </Item>
                </CardItem>
                <CardItem transparent>
                    <Text>From</Text>
                </CardItem>
                <CardItem transparent>
                    <Item regular>
                        <DatePicker
                            style={{width: 200}}
                            date={get(this.props, 'event.startDatetime', new Date())}
                            mode="datetime"
                            placeholder="select date"
                            format="MMM Do YY h:mm a"
                            minDate={new Date()} // no past events
                            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))} // one year in the future
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {
                                this.props.inputChange('event.startDatetime', new Date(moment(date, 'MMM Do YY h:mm a').format()));
                            }}
                        />
                    </Item>
                </CardItem>
                <CardItem transparent>
                    <Text>Until</Text>
                </CardItem>
                <CardItem transparent>
                    <Item regular>
                        <DatePicker
                            style={{width: 200}}
                            date={get(this.props, 'event.endDatetime', new Date())}
                            mode="datetime"
                            placeholder="select date"
                            format="MMM Do YY h:mm a"
                            minDate={get(this.props, 'event.startDatetime', new Date())} // start time?
                            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))} // one year in the future
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {
                                this.props.inputChange('event.endDatetime', new Date(moment(date, 'MMM Do YY h:mm a').format()));
                            }}
                        />
                    </Item>
                </CardItem>
                <CardItem transparent>
                    <Textarea 
                        style={styles.textArea} 
                        value={get(this.props, 'event.details', '')}
                        rowSpan={2} 
                        bordered
                        onChangeText={(value) => { this.props.inputChange('event.details', value); }} 
                        placeholder='Any additional details for your friends... (optional)' />
                </CardItem>
            </Content>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        event: formsSelector(state).event,
        newEventCreated: eventSelector(state).newEventCreated,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(PhysicalLocationEvent);