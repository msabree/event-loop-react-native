import React, { Component } from 'react';
import { Container } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';

import Loading from '../components/Loading';
import EnterPhoneNumber from '../components/EnterPhoneNumber';
import EnterVerificationCode from '../components/EnterVerificationCode';
import SpinnerModal from '../components/SpinnerModal';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import authenticationSelector from '../selectors/authentication';
import spinnerSelector from '../selectors/spinner';

class AuthenticationContainer extends Component {
    
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
    }

    async componentDidMount() {
        if(this.props.invalidSession === true){
            this.props.removeSession();
        }
        else{
            await this.props.getSessionTokenFromLocalStorage();
            this.props.getLoggedInUserInfo();
        }
    }

    componentDidUpdate() {
        if(this.props.sessionToken !== '' && this.props.sessionToken !== null){
            // remove authentication screen from stack history
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
            });
            this.props.navigation.dispatch(resetAction);
        }
    }

    getContent() {
        if(this.props.sessionToken === ''){
            return (
                <Loading/>
            )
        }
        else if(this.props.verificationCodeRequested === false){
            return (
                <EnterPhoneNumber 
                    phoneNumber={this.props.phoneNumber} 
                    changedPhoneNumberText={(phoneNumber) => this.changedPhoneNumberText(phoneNumber)}
                    requestVerificationCode={() => this.requestVerificationCode()}
                />
            )
        }
        else if(this.props.verificationCodeRequested === true){
            return (
                <EnterVerificationCode 
                    verificationCode={this.props.verificationCode} 
                    changedVerificationCodeText={(verificationCode) => this.changedVerificationCodeText(verificationCode)}
                    verifyPhoneNumber={() => this.verifyPhoneNumber()}
                />
            )
        }
        return (
            <EnterPhoneNumber 
                phoneNumber={this.props.phoneNumber} 
                changedPhoneNumberText={(phoneNumber) => this.changedPhoneNumberText(phoneNumber)}
                requestVerificationCode={() => this.requestVerificationCode()}
            />
        )
    }

    changedPhoneNumberText(phoneNumber) {
        this.props.changedPhoneNumberText(phoneNumber);
    }

    changedVerificationCodeText(verificationCode) {
        this.props.changedVerificationCodeText(verificationCode);
    }

    requestVerificationCode() {
        this.props.requestVerificationCode();
    }

    verifyPhoneNumber() {
        this.props.verifyPhoneNumber();
    }

    render() {
        return (
            <Container style={{backgroundColor: '#f58b07d6'}}>
                {this.getContent()}
                <SpinnerModal hideSpinner={this.props.hideSpinner} visible={this.props.spinnerVisible} message={this.props.spinnerMessage} />
            </Container>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        invalidSession: authenticationSelector(state).invalidSession,
        sessionToken: authenticationSelector(state).sessionToken,
        phoneNumber: authenticationSelector(state).phoneNumber,
        verificationCode: authenticationSelector(state).verificationCode,
        verificationCodeRequested: authenticationSelector(state).verificationCodeRequested,
        spinnerVisible: spinnerSelector(state).visible,
        spinnerMessage: spinnerSelector(state).message,
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationContainer);