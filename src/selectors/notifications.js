const notificationsSelector = (state) => {
    return {
        notifications: state.notificationsReducer.list,
        badgeCount: state.notificationsReducer.badgeCount,
        refreshing: state.notificationsReducer.refreshing,
    }
};

export default notificationsSelector;