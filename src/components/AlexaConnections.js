import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Container, Card, CardItem, Text, Fab, Icon, Button } from 'native-base';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

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
                    text: 'Yes', onPress: async () => {
                        await this.props.deleteAlexaConnection()
                        await this.props.getLoggedInUserInfo();
                        this.props.navigation.goBack();
                    }
                },
            ],
            {cancelable: false},
        ); 
    }

    getConnections() {
        const {
            activeAlexaConnection
        } = this.props.navigation.state.params;

        if(activeAlexaConnection === false){
            return(
                <Card transparent style={styles.center}>
                    <CardItem transparent header>
                        <Text>
                            There are no Alexa devices currently paired. 
                            To connect a new device press the button in the bottom right corner.
                            Ensure your Alexa device already has the Event Loop skill enabled.
                        </Text>
                    </CardItem>
                </Card>
            )
        }
        return(
            <Card transparent style={styles.center}>
                <CardItem transparent header>
                    <Text>
                        Your Amazon Alexa device is already connected. You can use the Event Loop skill on any Alexa device associated
                        with your Amazon Alexa account. If your Alexa pairing is not working you can resync at anytime using
                        the button in the bottom right corner. Please remember any previous Alexa sessions will be reset.
                    </Text>
                </CardItem>
                <CardItem transparent header>
                    <Text>
                        If you would like to delete the pairing you can do so a well.
                    </Text>
                </CardItem>
                <CardItem transparent header>
                    <Button danger onPress={() => {
                        this.confirmDeleteAlexaConnection()
                    }}>
                        <Text>Delete Alexa Connection</Text>
                    </Button>
                </CardItem>
            </Card>
        )
    }

    render() {
        return (
            <React.Fragment>
                {this.getConnections()}
                <Container>  
                    <Fab
                        active={true}
                        direction="up"
                        containerStyle={{ }}
                        style={{ backgroundColor: '#f58b07d6' }}
                        position="bottomRight"
                        onPress={() => {
                            const {
                                activeAlexaConnection
                            } = this.props.navigation.state.params;
                            if(activeAlexaConnection){
                                //alert('Delete coming soon');
                                this.props.navigation.navigate('AlexaSync');
                            }
                            else{
                                this.props.navigation.navigate('AlexaSync');
                            }
                        }}>
                        <Icon name="sync" />
                    </Fab>
                </Container>
            </React.Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {}    
}

export default connect(mapStateToProps, mapDispatchToProps)(AlexaConnections);