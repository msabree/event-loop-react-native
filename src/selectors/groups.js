const groupsSelector = state => {
  return {
    groups: state.groupsReducer,
  };
};

export default groupsSelector;
