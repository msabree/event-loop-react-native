const authenticationSelector = (state) => {
    return {
        invalidSession: state.authenticationReducer.invalidSession,
        sessionToken: state.authenticationReducer.sessionToken,
        phoneNumber: state.authenticationReducer.phoneNumber,
        verificationCode: state.authenticationReducer.verificationCode,
        verificationCodeRequested: state.authenticationReducer.verificationCodeRequested,
    }
};

export default authenticationSelector;