import React from 'react';
import {StyleSheet} from 'react-native';
import {Content, Text, H3, Item, Input, Button} from 'native-base';

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

export default class EnterVerificationCode extends React.Component {
  render() {
    return (
      <Content contentContainerStyle={styles.content}>
        <H3 style={styles.header}>Enter the verfication code to continue.</H3>
        <Item regular style={styles.item}>
          <Input
            autoFocus={true}
            style={styles.input}
            keyboardType={'phone-pad'}
            placeholder="We sent a code to your phone."
            placeholderTextColor={'#e6e6e6d6'}
            value={this.props.verificationCode}
            onChangeText={this.props.changedVerificationCodeText}
          />
        </Item>
        <Button block warning onPress={this.props.verifyPhoneNumber}>
          <Text>Confirm Code</Text>
        </Button>
      </Content>
    );
  }
}
