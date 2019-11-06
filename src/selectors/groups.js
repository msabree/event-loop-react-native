const groupsSelector = state => {
  return {
    groupIdSelected: state.groupsReducer.editting.groupId,
    groups: state.groupsReducer.current,
    modalVisible: state.groupsReducer.editting.modalVisible,
    selectedFriendIds: state.groupsReducer.editting.selectedFriendIds,
  };
};

export default groupsSelector;
