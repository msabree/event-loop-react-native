import React from 'react';
import {StyleSheet, Modal, View, Text} from 'react-native';

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
    width: 300,
    height: 300,
    borderRadius: 14,
  },
});

export default class BasicModal extends React.Component {
  render() {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.props.isOpen}
        onRequestClose={() => {
          this.props.onRequestClose();
        }}>
        <View style={styles.outerContainer}>
          <View
            style={this.props.innerContainerStyles || styles.innerContainer}>
            {this.props.content || <Text>Missing content prop :)</Text>}
          </View>
        </View>
      </Modal>
    );
  }
}
