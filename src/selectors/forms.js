const formsSelector = (state) => {
    return {
        event: state.formsReducer.event,
        appFeedback: state.formsReducer.appFeedback,
    }
};

export default formsSelector;