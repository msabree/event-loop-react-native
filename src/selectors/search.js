const searchSelector = (state) => {
    return {
        suggestions: state.searchReducer.suggestions,
    }
};

export default searchSelector;