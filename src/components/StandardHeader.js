import React from 'react';
import { Header, Text } from 'native-base';

export default class StandardHeader extends React.Component {

    render() {
        return (
            <Header style={{backgroundColor: '#fff'}}>
                <Text>{this.props.title || ''}</Text>
            </Header>
        )
    }
}