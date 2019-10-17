const spinnerSelector = state => {
  return {
    visible: state.spinnerReducer.visible,
    message: state.spinnerReducer.message,
  };
};

export default spinnerSelector;
