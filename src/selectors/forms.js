const formsSelector = state => {
  return {
    physicalLocationEvent: state.formsReducer.physicalLocationEvent,
    videoChatEvent: state.formsReducer.videoChatEvent,
    phoneCallEvent: state.formsReducer.phoneCallEvent,
    appFeedback: state.formsReducer.appFeedback,
    groupTitle: state.formsReducer.manageGroups.title,
  };
};

export default formsSelector;
