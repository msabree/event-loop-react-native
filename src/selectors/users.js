const usersSelector = (state) => {
    return {
        loggedInUsername: state.usersReducer.loggedIn.username,
        loggedInDisplayName: state.usersReducer.loggedIn.displayName,
        loggedInProfilePic: state.usersReducer.loggedIn.profilePic,
        loggedInUserId: state.usersReducer.loggedIn.userId,
        loggedInActiveAlexaConnection: state.usersReducer.loggedIn.activeAlexaConnection,
        editUserInfoModalOpen: state.usersReducer.editUserInfoModalOpen,
        edittedUsername: state.usersReducer.edittedUsername,
        edittedDisplayName: state.usersReducer.edittedDisplayName,
    }
};
  
export default usersSelector;