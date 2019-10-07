import React from 'react';
import { StyleSheet} from 'react-native';
import { Content, Card, CardItem, Item, Textarea, Button, Input, Text, Icon } from 'native-base';
import DatePicker from 'react-native-datepicker';
import get from 'lodash/get';
import moment from 'moment';

import formsSelector from '../../selectors/forms';
import eventSelector from '../../selectors/events';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../actions';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textArea: {
        width: '100%'
    },
});

class PhoneCallEvent extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Content>
                <CardItem transparent>
                    <Item regular>
                        <Input
                            placeholderTextColor={'#5d5d5d80'} 
                            placeholder={`Enter a short title`}
                            value={get(this.props, 'phoneCallEvent.title', '')}
                            onChangeText={(value) => this.props.inputChange('phoneCallEvent.title', value)}
                        />
                    </Item>
                </CardItem>
                <CardItem transparent>
                    <Item regular>
                        <Input
                            placeholderTextColor={'#5d5d5d80'} 
                            placeholder={`Dial-in Phone Number`}
                            value={get(this.props, 'phoneCallEvent.phoneNumber', '')}
                            onChangeText={(value) => this.props.inputChange('phoneCallEvent.phoneNumber', value)}
                        />
                    </Item>
                </CardItem>
                <CardItem transparent>
                    <Item regular>
                        <Input
                            placeholderTextColor={'#5d5d5d80'} 
                            placeholder={`Dial-in Passcode`}
                            value={get(this.props, 'phoneCallEvent.passCode', '')}
                            onChangeText={(value) => this.props.inputChange('phoneCallEvent.passCode', value)}
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
                            date={get(this.props, 'phoneCallEvent.startDatetime', new Date())}
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
                                this.props.inputChange('phoneCallEvent.startDatetime', new Date(moment(date, 'MMM Do YY h:mm a').format()));
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
                            date={get(this.props, 'phoneCallEvent.endDatetime', new Date())}
                            mode="datetime"
                            placeholder="select date"
                            format="MMM Do YY h:mm a"
                            minDate={get(this.props, 'phoneCallEvent.startDatetime', new Date())} // start time?
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
                                this.props.inputChange('phoneCallEvent.endDatetime', new Date(moment(date, 'MMM Do YY h:mm a').format()));
                            }}
                        />
                    </Item>
                </CardItem>
                <CardItem transparent>
                    <Textarea 
                        style={styles.textArea} 
                        value={get(this.props, 'phoneCallEvent.details', '')}
                        rowSpan={2} 
                        bordered
                        onChangeText={(value) => { this.props.inputChange('phoneCallEvent.details', value); }} 
                        placeholder='Enter event details' />
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
        phoneCallEvent: formsSelector(state).phoneCallEvent,
        newEventCreated: eventSelector(state).newEventCreated,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneCallEvent);