import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Card, CardItem, Text, Fab, Icon } from 'native-base';

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
        title: 'Alexa Connections',
    };

    getConnections() {
        if(this.props.connections.length === 0){
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
                            this.props.navigation.navigate('AlexaSync');
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
    return {
        connections: []
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(AlexaConnections);