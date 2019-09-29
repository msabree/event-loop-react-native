import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Container, ListItem, Body, Text } from 'native-base';
import moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import notificationsSelector from '../selectors/notifications';

class Notifications extends Component {

    static navigationOptions = {
        title: 'Notifications',
    };

    async componentDidMount() {
        await this.props.getNotifications();
        this.props.markNotificationsRead();
    }

    render() {
        return (
            <Container>
                <FlatList
                    onRefresh={async () => { 
                        await this.props.getNotifications(true) 
                        this.props.markNotificationsRead()
                    }}
                    refreshing={this.props.refreshing}
                    data={this.props.notifications.sort(function(a,b){
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return new Date(b.createdDatetime) - new Date(a.createdDatetime);
                    })}
                    renderItem={({ item }) => {
                        return (
                            <ListItem>
                                <Body>
                                    <Text>{item.message}</Text>
                                    <Text note>{moment(item.createdDatetime).fromNow()}</Text>
                                </Body>
                            </ListItem>
                        )
                    }}
                    keyExtractor={item => item._id}
                />
            </Container>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        notifications: notificationsSelector(state).notifications,
        refreshing: notificationsSelector(state).refreshing,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);