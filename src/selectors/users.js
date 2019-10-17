const usersSelector = state => {
  return {
    loggedInUsername: state.usersReducer.loggedIn.username,
    loggedInDisplayName: state.usersReducer.loggedIn.displayName,
    loggedInProfilePic: state.usersReducer.loggedIn.profilePic,
    loggedInUserId: state.usersReducer.loggedIn.userId,
    alexaSessionTokenActive:
      state.usersReducer.loggedIn.alexaSessionTokenActive,
    notifyNewEvents: state.usersReducer.loggedIn.notifyNewEvents,
    notifyFriendRequests: state.usersReducer.loggedIn.notifyFriendRequests,
    notifyHostEventChanges: state.usersReducer.loggedIn.notifyHostEventChanges,
    notifyJoinedEventChanges:
      state.usersReducer.loggedIn.notifyJoinedEventChanges,
    editUserInfoModalOpen: state.usersReducer.editUserInfoModalOpen,
    edittedUsername: state.usersReducer.edittedUsername,
    edittedDisplayName: state.usersReducer.edittedDisplayName,
  };
};

export default usersSelector;
