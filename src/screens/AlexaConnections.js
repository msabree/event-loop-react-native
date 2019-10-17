import React from 'react';
import {StyleSheet, Alert} from 'react-native';
import {Container, Card, CardItem, Text, Fab, Icon, Button} from 'native-base';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../actions';

import userSelector from '../selectors/users';
import alexaSelector from '../selectors/alexa';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class AlexaConnections extends React.Component {
  static navigationOptions = {
    title: 'Alexa Connection',
  };

  componentDidMount() {
    this.props.getLoggedInUserInfo();
  }

  componentDidUpdate(prevProps) {
    if (this.props.connected !== prevProps.connected) {
      this.props.getLoggedInUserInfo();
    }
  }

  confirmDeleteAlexaConnection() {
    Alert.alert(
      'Confirm Delete Alexa Connection',
      `Are you sure you want to delete the Alexa connection? You will have to resync your device.`,
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.props.deleteAlexaConnection();
            this.props.navigation.goBack();
          },
        },
      ],
      {cancelable: false},
    );
  }

  getSyncButton() {
    if (this.props.alexaSessionTokenActive === false) {
      return (
        <Container>
          <Fab
            active={true}
            direction="up"
            containerStyle={{}}
            style={{backgroundColor: 'orange'}}
            position="bottomRight"
            onPress={() => {
              this.props.navigation.navigate('AlexaSync');
            }}>
            <Icon name="sync" />
          </Fab>
        </Container>
      );
    }
  }

  getConnections() {
    if (this.props.alexaSessionTokenActive === false) {
      return (
        <Card transparent style={styles.center}>
          <CardItem transparent header>
            <Text>
              There are no Alexa devices currently paired. To connect a new
              device press the button in the bottom right corner. Ensure your
              Alexa device already has the Event Loop skill enabled.
            </Text>
          </CardItem>
        </Card>
      );
    }
    return (
      <Card transparent style={styles.center}>
        <CardItem transparent header>
          <Text>
            Your Amazon Alexa device is connected. You can use the Event Loop
            skill on any Alexa device associated with your Amazon Alexa account.
            If your Alexa pairing is not working you can delete the connection
            and resync. Please remember any previous Alexa sessions will be
            reset.
          </Text>
        </CardItem>
        <CardItem transparent header>
          <Button
            danger
            onPress={() => {
              this.confirmDeleteAlexaConnection();
            }}>
            <Text>Delete Alexa Connection</Text>
          </Button>
        </CardItem>
      </Card>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.getConnections()}
        {this.getSyncButton()}
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    alexaSessionTokenActive: userSelector(state).alexaSessionTokenActive,
    connected: alexaSelector(state).connected,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlexaConnections);
