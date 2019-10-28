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
  deals: {
    counter: {},
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
    },
  },
  authentication: {
    appStoreReviewMode: false,
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
      notifyNewEvents: false,
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
    physicalLocationEvent: {
      startDatetime: new Date(),
      endDatetime: new Date(),
      location: null,
      details: '',
      title: '',
    },
    videoChatEvent: {
      startDatetime: new Date(),
      endDatetime: new Date(),
      details: '',
      title: '',
      meetingLink: '',
    },
    phoneCallEvent: {
      startDatetime: new Date(),
      endDatetime: new Date(),
      details: '',
      title: '',
      passCode: '',
      phoneNumber: '',
    },
    appFeedback: {
      feedback: '',
    },
  },
};
