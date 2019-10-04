import React from 'react';
import { StyleSheet } from 'react-native';
import { Content, Text } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

class Groups extends React.Component {
    render() {
        return (
            <Content>
                <Text>manage friend groups</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Groups);