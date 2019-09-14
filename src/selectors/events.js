const eventsSelector = (state) => {
    return {
        eventList: state.eventsReducer.list,
        fetchingNew: state.eventsReducer.fetchingNew,
        sliderIndex: state.eventsReducer.sliderIndex,
        guestList: state.eventsReducer.guestList,
        eventsFilter: state.eventsReducer.filter,
        newEventCreated: state.eventsReducer.created,
    }
};

export default eventsSelector;