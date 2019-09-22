import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Content, Card, CardItem, H1, Text, Toast } from 'native-base';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import alexaSelector from '../selectors/alexa';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

class AlexaSync extends React.Component {

    static navigationOptions = {
        title: 'Sync New Device',
    };

    constructor(props){
        super(props);
        this.state = {
            pollInterval: -1,
            attempt: 0,
            maxAttempts: 20,
        }
    }

    async componentDidMount() {

        this.props.showSpinner('Generating new sync code... Please wait.');
        await this.props.inititateAlexaSync();
        this.props.hideSpinner();

        const pollInterval = setInterval(() => {
            this.props.checkAlexaSync();
            const attempt = this.state.attempt + 1;
            this.setState({
                attempt,
            })
        }, 3000);

        this.setState({
            pollInterval,
        })
    }


    async componentDidUpdate(prevProps) {
        if (this.props.showConfirmation !== prevProps.showConfirmation && this.props.showConfirmation === true) {
            this.confirmSyncDevice();
        }
        console.log(this.state)
        if(this.state.attempt > this.state.maxAttempts && this.state.pollInterval !== -1){
            Toast.show({
                text: 'Pairing timed out. Please try again later.',
                buttonText: 'Close',
                type: 'warning',
                duration: 3000,
            })
            clearInterval(this.state.pollInterval);
            this.props.navigation.goBack();
        }
    }

    componentWillUnmount() {
        if(this.state.pollInterval !== -1){
            clearInterval(this.state.pollInterval);
        }

        this.setState({
            pollInterval: -1,
        })
    }

    confirmSyncDevice() {
        Alert.alert(
            'Incoming Alexa Sync Request',
            `Do you want to accept this sync request?`,
            [
                {
                    text: 'Deny',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Accept', onPress: () => {
                        this.props.confirmSyncRequest();
                        this.props.navigation.goBack();
                    }
                },
            ],
            {cancelable: false},
        );    
    }

    render() {
        return (
            <Content>
                <Card transparent style={styles.center}>
                    <CardItem>
                        <Text note>
                            To sync a new device you must first enable the Event Loop Alexa skill on your Alexa device.
                            To sync device please follow the two steps listed below. Remember to confirm the request to
                            complete the process.
                        </Text>
                    </CardItem>
                </Card>
                <Card transparent style={styles.center}>
                    <CardItem header>
                        <H1>Code: {this.props.syncCode}</H1>
                    </CardItem>
                    <CardItem>
                        <Text note>
                            Say: 'Alexa, Open Event Loop.' (Wait for response)
                        </Text>
                    </CardItem>
                    <CardItem>
                        <Text note>
                            Say: 'Device Code {this.props.syncCode}.' (You will get a prompt to confirm pairing.)
                        </Text>
                    </CardItem>
                </Card>
            </Content>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        syncCode: alexaSelector(state).syncCode,
        showConfirmation: alexaSelector(state).showConfirmation,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(AlexaSync);