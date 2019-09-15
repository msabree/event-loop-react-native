const friendsSelector = (state) => {
    return {
        activeSegment: state.friendsReducer.activeSegment,
        current: state.friendsReducer.current,
        requests: state.friendsReducer.requests,
        sentRequests: state.friendsReducer.sentRequests,
    }
};

export default friendsSelector;