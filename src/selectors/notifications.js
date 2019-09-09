const notificationsSelector = (state) => {
    return {
        notifications: state.notificationsReducer.list,
        badgeCount: state.notificationsReducer.badgeCount,
    }
};

export default notificationsSelector;