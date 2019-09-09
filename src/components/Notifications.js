import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Content, ListItem, Text } from 'native-base';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import notificationsSelector from '../selectors/notifications';

class Notifications extends Component {

    static navigationOptions = {
        title: 'Notifications',
    };

    componentDidMount() {
        this.props.getNotifications();
    }

    render() {
        return (
            <Content>
                <FlatList
                    data={this.props.notifications}
                    renderItem={({ item }) => {
                        return (
                            <ListItem>
                                <Text>{item.message}</Text>
                            </ListItem>
                        )
                    }}
                    keyExtractor={item => item._id}
                />
            </Content>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        notifications: notificationsSelector(state).notifications,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);