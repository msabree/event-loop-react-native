import {Toast} from 'native-base';
import get from 'lodash/get';
import * as actionTypes from '../constants/actionTypes';
import formsSelector from '../selectors/forms';
import authenticationSelector from '../selectors/authentication';
import usersSelector from '../selectors/users';
import api from '../utils/api';

export const saveEvent = (
  eventType = 'location',
  eventId = '',
  guestList = [],
  isUpdate = false,
) => (dispatch, getState) => {
  const sessionToken = get(
    authenticationSelector(getState()),
    'sessionToken',
    '',
  );
  let title = '';
  let details = '';
  let startDatetime = new Date();
  let endDatetime = new Date();
  let location = null;
  let phoneNumber = '';
  let passCode = '';
  let meetingLink = '';

  if (eventType === 'location') {
    const physicalLocationEvent = get(
      formsSelector(getState()),
      'physicalLocationEvent',
      {},
    );
    title = physicalLocationEvent.title;
    details = physicalLocationEvent.details;
    startDatetime = physicalLocationEvent.startDatetime;
    endDatetime = physicalLocationEvent.endDatetime;
    location = physicalLocationEvent.location;
  } else if (eventType === 'phone') {
    const phoneCallEvent = get(formsSelector(getState()), 'phoneCallEvent', {});
    title = phoneCallEvent.title;
    details = phoneCallEvent.details;
    startDatetime = phoneCallEvent.startDatetime;
    endDatetime = phoneCallEvent.endDatetime;
    phoneNumber = phoneCallEvent.phoneNumber;
    passCode = phoneCallEvent.passCode;
  } else if (eventType === 'video') {
    const videoChatEvent = get(formsSelector(getState()), 'videoChatEvent', {});
    title = videoChatEvent.title;
    details = videoChatEvent.details;
    startDatetime = videoChatEvent.startDatetime;
    endDatetime = videoChatEvent.endDatetime;
    meetingLink = videoChatEvent.meetingLink;
  }

  if (eventType === 'location' && location === null) {
    Toast.show({
      text: 'Use the autocomplete to select an address or specific location.',
      buttonText: 'Close',
      type: 'warning',
      duration: 5000,
    });
  } else if (title === '') {
    Toast.show({
      text: 'Enter a title for this event.',
      buttonText: 'Close',
      type: 'warning',
      duration: 5000,
    });
  } else if (new Date(startDatetime) >= new Date(endDatetime)) {
    Toast.show({
      text: 'The end date time must be after the start date time.',
      buttonText: 'Close',
      type: 'warning',
      duration: 5000,
    });
  } else if (new Date() > new Date(startDatetime)) {
    Toast.show({
      text: 'The start time must be in the future.',
      buttonText: 'Close',
      type: 'warning',
      duration: 5000,
    });
  } else if (eventType === 'phone' && phoneNumber === '') {
    Toast.show({
      text: 'A dial-in number is required.',
      buttonText: 'Close',
      type: 'warning',
      duration: 5000,
    });
  } else if (eventType === 'video' && meetingLink === '') {
    Toast.show({
      text: 'A meeting link is required.',
      buttonText: 'Close',
      type: 'warning',
      duration: 5000,
    });
  } else {
    let apiCall = null;
    if (isUpdate === true) {
      apiCall = api.put(`/events/${eventId}`, {
        sessionToken,
        location,
        title,
        details,
        startDatetime,
        endDatetime,
        guestList,
        passCode,
        phoneNumber,
        meetingLink,
        eventType,
      });
    } else {
      apiCall = api.post(`/events`, {
        sessionToken,
        location,
        title,
        details,
        startDatetime,
        endDatetime,
        passCode,
        phoneNumber,
        meetingLink,
        eventType,
      });
    }

    apiCall
      .then(apiResponse => {
        if (
          get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
        ) {
          return dispatch({
            type: actionTypes.INVALID_SESSION,
          });
        }

        if (apiResponse.success === true) {
          Toast.show({
            text:
              isUpdate === true
                ? 'Event was updated successfully!'
                : 'Event was created successfully!',
            buttonText: 'Close',
            type: 'success',
            duration: 3000,
          });
          dispatch({
            type: actionTypes.NEW_EVENT_CREATED,
          });
          return dispatch(getEvents());
        } else {
          Toast.show({
            text:
              isUpdate === true
                ? 'Unable to update event. Please try again later.'
                : 'Unable to create event. Please try again later.',
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
          });
        }
      })
      .catch(err => {
        console.log(err);
        Toast.show({
          text:
            isUpdate === true
              ? 'Unhandled error. Unable to update event. Please try again later.'
              : 'Unhandled error. Unable to create event. Please try again later.',
          buttonText: 'Close',
          type: 'warning',
          duration: 5000,
        });
      });
  }
};

export const deleteEvent = event => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .delete(`/events/${sessionToken}/${event.eventId}`, {
      guestList: event.guestList,
      title: event.title,
    })
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      dispatch(getEvents());
    })
    .catch(err => {
      console.log(err);
    });
};

export const getEvents = (dispatchFetchingEvents = false) => (
  dispatch,
  getState,
) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');
  const usersState = usersSelector(getState());
  const loggedInUserId = get(usersState, 'loggedInUserId', '');

  if (dispatchFetchingEvents) {
    dispatch({
      type: actionTypes.FETCHING_EVENTS,
    });
  }

  api
    .get(`/events/${sessionToken}`)
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      return dispatch({
        type: actionTypes.GET_EVENTS,
        payload: {
          apiResponse,
          loggedInUserId,
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getGuestList = eventId => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .get(`/events/guest-list/${eventId}/${sessionToken}`)
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      return dispatch({
        type: actionTypes.GET_EVENT_GUEST_LIST,
        payload: {
          apiResponse,
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const joinEvent = event => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .post(`/events/guest-list`, {
      event,
      sessionToken,
    })
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      dispatch(getEvents());
      return dispatch(getGuestList(event.eventId));
    })
    .catch(err => {
      console.log(err);
    });
};

export const leaveEvent = event => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .delete(`/events/guest-list`, {
      event,
      sessionToken,
    })
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      dispatch(getEvents());
      return dispatch(getGuestList(event.eventId));
    })
    .catch(err => {
      console.log(err);
    });
};

export const resetEventForms = () => dispatch => {
  return dispatch({
    type: actionTypes.RESET_EVENT_FORMS,
  });
};

export const changeEventsFilter = (filter = 'upcoming') => dispatch => {
  dispatch({
    type: actionTypes.CHANGE_EVENTS_FILTER,
    payload: {
      filter,
    },
  });

  return dispatch(getEvents());
};

export const getComments = (eventId = '') => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .get(`/events/comments/${eventId}/${sessionToken}`)
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      return dispatch({
        type: actionTypes.GET_EVENT_COMMENTS,
        payload: {
          apiResponse,
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const postComment = (eventId, comment = '', isCreator) => (
  dispatch,
  getState,
) => {
  if (comment.trim() !== '') {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api
      .post(`/events/comments/${sessionToken}`, {
        eventId,
        comment,
        isCreator,
      })
      .then(apiResponse => {
        if (
          get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
        ) {
          return dispatch({
            type: actionTypes.INVALID_SESSION,
          });
        }

        dispatch(getComments(eventId));

        console.log(apiResponse);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

export const clearComments = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.CLEAR_EVENT_COMMENTS,
  });
};

export const deleteComment = commentId => (dispatch, getState) => {
  const authenticationState = authenticationSelector(getState());
  const sessionToken = get(authenticationState, 'sessionToken', '');

  api
    .delete(`/events/comments/${commentId}/${sessionToken}`)
    .then(apiResponse => {
      if (
        get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'
      ) {
        return dispatch({
          type: actionTypes.INVALID_SESSION,
        });
      }

      return dispatch({
        type: actionTypes.DELETE_COMMENT,
        payload: {
          commentId,
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const editComment = commentId => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.EDIT_COMMENT,
    payload: {
      commentId,
    },
  });
};
