import React from 'react';
import { StyleSheet } from 'react-native';
import { Content, Text, H3, Item, Input, Button } from 'native-base';
import { AsYouType } from 'libphonenumber-js';

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingRight: 30,
        paddingLeft: 30,
        backgroundColor: '#f58b07d6',
    },
    header: {
        color: '#ffffff',
        marginBottom: 30,
    },
    item: {
        color: '#ffffff',
        marginBottom: 30,
    },
    input: {
        color: '#ffffff',
    },
});

export default class EnterPhoneNumber extends React.Component {

    formatPhone(phone = '') {
        return new AsYouType('US').input(phone.toString());
    }

    render() {
        return (
            <Content contentContainerStyle={styles.content}>
                <H3 style={styles.header}>Welcome to Flaker! To get started, enter your phone number.</H3>
                <Item regular style={styles.item}>
                    <Input
                        autoFocus={true}
                        style={styles.input} 
                        keyboardType={'phone-pad'}
                        placeholder='Enter your phone number.'
                        placeholderTextColor={'#e6e6e6d6'} 
                        value={this.formatPhone(this.props.phoneNumber)} 
                        onChangeText={this.props.changedPhoneNumberText}/>
                </Item>
                <Button block warning onPress={this.props.requestVerificationCode}>
                    <Text>Request Verification Code</Text>
                </Button>
            </Content>
        )
    }
}