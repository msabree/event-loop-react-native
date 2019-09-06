const alexaSelector = (state) => {
    return {
        syncCode: state.alexaReducer.syncCode,
        showConfirmation: state.alexaReducer.showConfirmation,
    }
};

export default alexaSelector;