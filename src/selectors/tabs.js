const tabsSelector = state => {
  return {
    activeTabIndex: state.tabsReducer.activeIndex,
  };
};

export default tabsSelector;
