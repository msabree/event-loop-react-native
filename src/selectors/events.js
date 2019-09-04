const eventsSelector = (state) => {
    return {
        eventList: state.eventsReducer.list,
        sliderIndex: state.eventsReducer.sliderIndex,
        guestList: state.eventsReducer.guestList,
    }
};

export default eventsSelector;