import React, { Component } from 'react';
import { Content, List, ListItem, Text, Body } from 'native-base';

export default class Settings extends Component {

    static navigationOptions = {
        title: 'Settings',
        header: {
            visible: true
        }
    };

    render() {
        return (
            <Content>
                <List>
                    <ListItem itemDivider>
                    <Text>Device</Text>
                    </ListItem>                    
                    <ListItem onPress={() => { this.props.navigation.navigate('AlexaConnections'); }}>
                        <Body>
                            <Text>Alexa</Text>
                            <Text note>No active connection</Text>
                        </Body>
                    </ListItem>
                </List>
            </Content>
        );
    }
}