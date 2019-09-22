const alexaSelector = (state) => {
    return {
        syncCode: state.alexaReducer.syncCode,
        showConfirmation: state.alexaReducer.showConfirmation,
        connected: state.alexaReducer.connected,
    }
};

export default alexaSelector;