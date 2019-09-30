export default {
    appInfo: {
        connected: true,
    },
    search: {
        suggestions: [],
    },
    notifications: {
        list: [],
        badgeCount: 0,
        refreshing: false,
    },
    spinner: {
        visible: false,
        message: '',
    },
    tabs: {
        activeIndex: 0,
    },
    friends: {
        activeSegment: 'current',
        current: [],
        requests: [],
        sentRequests: [],
        previewUser: {
            modalVisible: false,
            friendStatus: 'none',
            profile: null,
        }
    },
    authentication: {
        heroMode: false,
        invalidSession: false,
        sessionToken: null, // '' -> loading, null -> no session '<SESSIONTOKEN>' -> a session token was found
        phoneNumber: '',
        verificationCodeRequested: false,
    },
    users: {
        loggedIn: {
            username: '',
            displayName: '',
            userId: '',
            profilePic: 'https://flaker-images.s3.amazonaws.com/default-profile.png',
            notifyFriendRequests: false,
            notifyHostEventChanges: false,
            notifyJoinedEventChanges: false,
        },
        // edit user info
        editUserInfoModalOpen: false,
        edittedUsername: '',
        edittedDisplayName: '',
    },
    events: {
        list: null,
        sliderIndex: 0,
        guestList: [],
        comments: [],
        fetchingNew: false,
        filter: 'upcoming',
        created: false,
    },
    alexa: {
        syncCode: '',
        showConfirmation: false,
        connected: '',
    },
    forms: {
        event: {
            startDatetime: new Date(),
            endDatetime: new Date(),
            location: null, 
            details: '',
            title: '',
        },
        appFeedback: {
            feedback: ''
        },
    },
}