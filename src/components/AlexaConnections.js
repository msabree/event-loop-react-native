import React from 'react';
import { StyleSheet } from 'react-native';
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
                            Ensure your Alexa device already has the Flaker skill enabled.
                        </Text>
                    </CardItem>
                </Card>
            )
        }
        return(
            <Card transparent style={styles.center}>
                <CardItem transparent header>
                    <Text>
                        Your Amazon Alexa device is already connected. You can use the Flaker skill on any Alexa device associated
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
                    <Button danger>
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