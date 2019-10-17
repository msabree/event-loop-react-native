import React from 'react';
import {StyleSheet, Modal, View} from 'react-native';
import {Content, Spinner, Text} from 'native-base';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#00000080',
    padding: 20,
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: '#fff',
    width: 250,
    height: 200,
    borderRadius: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class SpinnerModal extends React.Component {
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <Content contentContainerStyle={styles.center}>
              <Spinner color="grey" />
              <Text style={{color: 'grey'}}>{this.props.message || ''}</Text>
            </Content>
          </View>
        </View>
      </Modal>
    );
  }
}
