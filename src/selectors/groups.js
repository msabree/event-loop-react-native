const groupsSelector = state => {
  return {
    groups: state.groupsReducer.current,
    modalVisible: state.groupsReducer.modalVisible,
  };
};

export default groupsSelector;
