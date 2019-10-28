const dealsSelector = state => {
  return {
    counter: state.dealsReducer.counter,
  };
};

export default dealsSelector;
