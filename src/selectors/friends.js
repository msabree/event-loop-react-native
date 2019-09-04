const friendsSelector = (state) => {
    return {
        activeSegment: state.friendsReducer.activeSegment,
        current: state.friendsReducer.current,
        requests: state.friendsReducer.requests,
        sendFriendRequestPending: state.friendsReducer.sendFriendRequestPending,
    }
};

export default friendsSelector;