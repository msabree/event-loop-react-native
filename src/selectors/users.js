const usersSelector = (state) => {
    return {
        searchRequested: state.usersReducer.searchRequested,
        searchQuery: state.usersReducer.searchQuery,
        searchedUserId: state.usersReducer.searchedUserId,
        loggedInUsername: state.usersReducer.loggedIn.username,
        loggedInDisplayName: state.usersReducer.loggedIn.displayName,
        loggedInProfilePic: state.usersReducer.loggedIn.profilePic,
        loggedInUserId: state.usersReducer.loggedIn.userId,
        editUserInfoModalOpen: state.usersReducer.editUserInfoModalOpen,
        edittedUsername: state.usersReducer.edittedUsername,
        edittedDisplayName: state.usersReducer.edittedDisplayName,
    }
};
  
export default usersSelector;