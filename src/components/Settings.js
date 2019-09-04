import React from 'react';
import { StyleSheet } from 'react-native';
import { Content, Card, CardItem, H1, Text } from 'native-base';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

class Settings extends React.Component {

    constructor(props){
        super(props);

        state = {
            verifyInterval: -1,
            pollInterval: -1,
        }
    }

    componentDidMount() {
        const verifyInterval = setInterval(() => {
            this.getVerificationCodes();
        }, 60000);

        const pollInterval = setInterval(() => {
            this.pollForSuccess();
        }, 3000);

        this.setState({
            pollInterval,
            verifyInterval
        })

        this.getVerificationCodes();
        this.pollForSuccess();
    }

    componentWillUnmount() {
        if(this.state.verifyInterval !== -1){
            clearInterval(this.state.verifyInterval);
        }

        if(this.state.pollInterval !== -1){
            clearInterval(this.state.pollInterval);
        }

        this.setState({
            pollInterval: -1,
            verifyInterval: -1,
        })
    }

    getVerificationCodes() {
       console.log('getting new alexa sync code...') 
    }

    pollForSuccess() {
        console.log('checking for successful alexa sync...')
    }

    render() {
        return (
            <Content>
                <Card transparent style={styles.center}>
                    <CardItem header>
                        <H1>Alexa Sync</H1>
                    </CardItem>
                    <CardItem>
                        <Text>Instructions here</Text>
                    </CardItem>
                </Card>
                <Card transparent style={styles.center}>
                    <CardItem header>
                        <H1>Sync Code: 20-66</H1>
                    </CardItem>
                    <CardItem transparent>
                        <Text>Expires in: 60 secs</Text>
                    </CardItem>
                    <CardItem>
                        <Text>Sub instructions here</Text>
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
    return {}    
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);