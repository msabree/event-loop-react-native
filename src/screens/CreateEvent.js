import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Content, Card, CardItem, Item, Button, Text, Picker, Icon } from 'native-base';
import get from 'lodash/get';

import eventSelector from '../selectors/events';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

// Event Types
import PhysicalLocationEvent from '../components/Events/PhysicalLocation';
import VideoChatEvent from '../components/Events/VideoChat';
import PhoneCallEvent from '../components/Events/PhoneCall';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textArea: {
        width: '100%'
    },
});

class CreateEvent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            eventType: 'location',
        }
    }

    componentDidMount() {
        const {
            existingEvent,
        } = get(this.props, 'navigation.state.params', {});

        if(existingEvent){
            const existingEventTitle = get(existingEvent, 'title');
            const existingEventLocation = get(existingEvent, 'location');
            const existingEventStartDatetime = get(existingEvent, 'startDatetime');
            const existingEventEndDatetime = get(existingEvent, 'endDatetime');
            const existingEventDetails = get(existingEvent, 'details', '');

            // Fire updates
            this.props.inputChange('event.title', existingEventTitle)
            this.props.inputChange('event.location', existingEventLocation);
            this.props.inputChange('event.startDatetime', new Date(existingEventStartDatetime));
            this.props.inputChange('event.endDatetime', new Date(existingEventEndDatetime));
            this.props.inputChange('event.details', existingEventDetails)
        }
        else{
            this.props.resetEventForms();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.newEventCreated !== prevProps.newEventCreated && this.props.newEventCreated === true) {
            this.props.navigation.goBack();
        }
    }

    confirmDeleteEvent(existingEvent) {
        Alert.alert(
            'Delete Event',
            `This is a future event. Are you sure you would like to delete it?`,
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes', onPress: () => {
                        this.props.deleteEvent(existingEvent);
                        this.props.navigation.goBack();
                    }
                },
            ],
            {cancelable: false},
        );    
    }

    getEventContent(){
        const eventType = this.state.eventType;
        if(eventType === 'location'){
            return <PhysicalLocationEvent />
        }
        else if(eventType === 'video'){
            return <VideoChatEvent />
        }
        else if(eventType === 'phone'){
            return <PhoneCallEvent />
        }
        return <PhysicalLocationEvent />
    }

    getDeleteButton(existingEvent){
        if(existingEvent){
            return (
                <Button style={styles.center} danger transparent onPress={() => { 
                    this.confirmDeleteEvent(existingEvent);
                }}>
                    <Text>{'Delete Event'}</Text>
                </Button>   
            )
        }
    }

    render() {
        const {
            existingEvent,
        } = get(this.props, 'navigation.state.params', {});

        return (
            <Content>
                {
                    this.getDeleteButton(existingEvent)
                }
                <Card transparent>
                    <CardItem transparent>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                placeholder='Select Invite Type'
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.eventType}
                                onValueChange={(eventType) => {
                                    this.setState({
                                        eventType,
                                    })
                                }}
                            >
                                <Picker.Item label='Physical Location' value='location' />
                                <Picker.Item label='Phone Call' value='phone' />
                                <Picker.Item label='Video Chat' value='video' />
                            </Picker>
                        </Item>
                    </CardItem>
                    {this.getEventContent()}
                </Card>
                <Button block warning onPress={() => {
                    if(existingEvent === undefined){
                        this.props.createEvent(this.state.eventType);
                    }
                    else{
                        this.props.updateEvent(existingEvent.eventId, existingEvent.guestList, this.state.eventType);
                    }
                }}>
                    <Text>
                        {(existingEvent === undefined) ? 'Create' : 'Save'}
                    </Text>
                </Button>
            </Content>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        newEventCreated: eventSelector(state).newEventCreated,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);