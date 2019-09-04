import React from 'react';
import { StyleSheet } from 'react-native';
import { Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Button } from 'native-base';
import get from 'lodash/get';
import moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import eventsSelector from '../selectors/events';
import usersSelector from '../selectors/users';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

class GuestList extends React.Component {

    static navigationOptions = {
        title: 'Confirmed List',
    };

    componentDidMount() {
        const {
            eventId
        } = this.props.navigation.state.params;

        this.props.getGuestList(eventId);
    }

    getListActionButton(joined, eventId) {
        if(joined){
            return (
                <Button style={styles.center} danger transparent onPress={() => { 
                    this.props.leaveEvent(eventId);
                    this.props.getEvents();
                }}>
                    <Text>{'Leave Event'}</Text>
                </Button>
            )
        }
        return (
            <Button style={styles.center} success transparent onPress={() => { 
                this.props.joinEvent(eventId);
                this.props.getEvents();
            }}>
                <Text>{'Join Event'}</Text>
            </Button>
        )
    }

    render() {

        const {
            eventId,
        } = this.props.navigation.state.params;

        const arrGuestUserIds = this.props.guestList.map((guest) => {
            return guest.userId;
        })

        const joined = (arrGuestUserIds.indexOf(this.props.loggedInUserId) !== -1) ? true : false;

        return (
            <Content>
                {this.getListActionButton(joined, eventId)}
                <List>
                    {
                        this.props.guestList.map((guest, index) => {
                            return (
                                <ListItem avatar key={`${new Date().getTime()} - ${index}`}>
                                    <Left>
                                        <Thumbnail source={{ uri: get(guest, 'profile.profilePic', '') }} />
                                    </Left>
                                    <Body>
                                        <Text>{get(guest, 'profile.displayName') || get(guest, 'profile.username', '')}</Text>
                                        <Text note>{` `}</Text>
                                        <Text note>{` `}</Text>
                                    </Body>
                                    <Right>
                                        <Text note>{`Confirmed ${moment(guest.confirmedDatetime).fromNow()}`}</Text>
                                    </Right>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Content>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        guestList: eventsSelector(state).guestList,
        loggedInUserId: usersSelector(state).loggedInUserId,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(GuestList);