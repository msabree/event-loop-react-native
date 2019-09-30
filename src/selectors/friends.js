const friendsSelector = (state) => {
    return {
        activeSegment: state.friendsReducer.activeSegment,
        current: state.friendsReducer.current,
        requests: state.friendsReducer.requests,
        sentRequests: state.friendsReducer.sentRequests,
        profilePreviewModalVisible: state.friendsReducer.previewUser.modalVisible,
        profileToPreview: state.friendsReducer.previewUser.profile,
        friendStatus: state.friendsReducer.previewUser.friendStatus,
    }
};

export default friendsSelector;