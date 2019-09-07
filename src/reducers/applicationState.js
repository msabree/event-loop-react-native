export default {
    appInfo: {
        connected: true,
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
        sendFriendRequestPending: false,
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
        },
        searchQuery: '',
        searchedUserId: '',
        searchRequested: false,
        // edit user info
        editUserInfoModalOpen: false,
        edittedUsername: '',
        edittedDisplayName: '',
    },
    events: {
        list: null,
        sliderIndex: 0,
        guestList: [],
    },
    alexa: {
        syncCode: '',
        showConfirmation: false,
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
    }
}