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
  groups: {
    current: [
      {
        title: 'favorites',
        members: [
          '26863361-b8a3-11e9-873e-eb2226ce8f3f',
          'ec690111-b944-11e9-a138-5350a0cdfd9f_02',
        ],
        id: '1572611851030',
      },
    ],
    editting: {
      modalVisible: false,
      groupId: '',
      groupTitle: '',
      selectedFriendIds: [],
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
    manageGroups: {
      title: '',
    },
  },
};
