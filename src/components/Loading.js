import React from 'react';
import { Content, Spinner, Text } from 'native-base';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default class Loading extends React.Component {
    render() {
        return (
            <Content contentContainerStyle={styles.center}>
                <Spinner color='orange' />
                <Text>{this.props.message || ''}</Text>
            </Content>
        )
    }
}