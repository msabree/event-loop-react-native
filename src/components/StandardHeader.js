import React from 'react';
import { Header, Left, Text, Button, Icon } from 'native-base';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

class StandardHeader extends React.Component {
    
    getRightButton() {
        if(this.props.rightButtonIcon !== undefined){
            return (
                <Button dark transparent onPress={() => { this.props.onButtonPress() }}>
                    <Icon name={this.props.rightButtonIcon} />
                </Button>
            )
        }
        else if(this.props.rightButtonText !== undefined){
            <Button transparent onPress={() => { this.props.onButtonPress() }}>
                <Text>{this.props.rightButtonText}</Text>
            </Button>
        }
    }
    
    render() {
        return (
            <Header style={{
                backgroundColor: '#fff',
            }}>
                <Left>
                    <Text style={{
                        fontSize: 22
                    }}>{this.props.title || ''}</Text>
                </Left>
                {
                    this.getRightButton()
                }
            </Header>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {}    
}

export default connect(mapStateToProps, mapDispatchToProps)(StandardHeader);