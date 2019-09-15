import { Toast } from 'native-base';
import get from 'lodash/get';
import * as actionTypes from '../constants/actionTypes';
import formsSelector from '../selectors/forms';
import authenticationSelector from '../selectors/authentication';
import usersSelector from '../selectors/users';
import api from '../utils/api';

export const createEvent = () => (dispatch, getState) => {
    const sessionToken = get(authenticationSelector(getState()), 'sessionToken', '');
    const {
        location = null, 
        details = '', 
        title = '', 
        startDatetime = new Date(),
        endDatetime = new Date(),
    } = get(formsSelector(getState()), 'event', {});

    if(location === null){
        Toast.show({
            text: 'Use the autocomplete to select an address or specific location.',
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
        })
    }
    else if(title === ''){
        Toast.show({
            text: 'Enter a title for this event.',
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
        })
    }
    else if(new Date(startDatetime) >= new Date(endDatetime)){
        Toast.show({
            text: 'The end date time must be after the start date time.',
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
        })
    }
    else if(new Date() > new Date(startDatetime)){
        Toast.show({
            text: 'The start time must be in the future.',
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
        })
    }
    else{
        api.post(`/events`, {
            sessionToken,
            location,
            title,
            details,
            startDatetime,
            endDatetime,
        })
        .then((apiResponse) => {
            if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
                return dispatch({
                    type: actionTypes.INVALID_SESSION,
                })
            }

            if(apiResponse.success === true){
                Toast.show({
                    text: 'Event was created successfully!',
                    buttonText: 'Close',
                    type: 'success',
                    duration: 3000,
                })
                dispatch({
                    type: actionTypes.NEW_EVENT_CREATED,
                })
                return dispatch(getEvents())
            }
            else{
                Toast.show({
                    text: 'Unable to create event. Please try again later.',
                    buttonText: 'Close',
                    type: 'warning',
                    duration: 5000,
                })
            }
        })
        .catch((err) => {
            console.log(err);
            Toast.show({
                text: 'Unhandled error. Unable to create event. Please try again later.',
                buttonText: 'Close',
                type: 'warning',
                duration: 5000,
            })
        })
    }
}

export const updateEvent = (eventId, guestList = []) => (dispatch, getState) => {
    const sessionToken = get(authenticationSelector(getState()), 'sessionToken', '');
    const {
        location = null, 
        details = '', 
        title = '', 
        startDatetime = new Date(),
        endDatetime = new Date(),
    } = get(formsSelector(getState()), 'event', {});

    if(location === null){
        Toast.show({
            text: 'Use the autocomplete to select an address or specific location.',
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
        })
    }
    else if(title === ''){
        Toast.show({
            text: 'Enter a title for this event.',
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
        })
    }
    else if(new Date(startDatetime) >= new Date(endDatetime)){
        Toast.show({
            text: 'The end date time must be after the start date time.',
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
        })
    }
    else if(new Date() > new Date(startDatetime)){
        Toast.show({
            text: 'The start time must be in the future.',
            buttonText: 'Close',
            type: 'warning',
            duration: 5000,
        })
    }
    else{
        api.put(`/events/${eventId}`, {
            sessionToken,
            location,
            title,
            details,
            startDatetime,
            endDatetime,
            guestList,
        })
        .then((apiResponse) => {
            if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
                return dispatch({
                    type: actionTypes.INVALID_SESSION,
                })
            }

            if(apiResponse.success === true){
                Toast.show({
                    text: 'Event was updated successfully!',
                    buttonText: 'Close',
                    type: 'success',
                    duration: 3000,
                })
            }
            else{
                Toast.show({
                    text: 'Unable to update event. Please try again later.',
                    buttonText: 'Close',
                    type: 'warning',
                    duration: 5000,
                })
            }
    
            dispatch(getEvents())
        })
        .catch((err) => {
            console.log(err);
            Toast.show({
                text: 'Unhandled error. Unable to update event. Please try again later.',
                buttonText: 'Close',
                type: 'warning',
                duration: 5000,
            })
        })
    }
}

export const deleteEvent = (event) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.delete(`/events/${sessionToken}/${event.eventId}`, {
        guestList: event.guestList,
        title: event.title,
    })
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        dispatch(getEvents())
    })
    .catch((err) => {
        console.log(err);
    })   
}

export const getEvents = (dispatchFetchingEvents = false) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');
    const usersState = usersSelector(getState());
    const loggedInUserId = get(usersState, 'loggedInUserId', '');

    if(dispatchFetchingEvents){
        dispatch({
            type: actionTypes.FETCHING_EVENTS,
        })
    }

    api.get(`/events/${sessionToken}`)
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        return dispatch({
            type: actionTypes.GET_EVENTS,
            payload: {
                apiResponse,
                loggedInUserId,
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })   
}

export const getGuestList = (eventId) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.get(`/events/guest-list/${eventId}/${sessionToken}`)
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }
        
        return dispatch({
            type: actionTypes.GET_EVENT_GUEST_LIST,
            payload: {
                apiResponse
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })   
}

export const joinEvent = (event) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.post(`/events/guest-list`, {
        event,
        sessionToken,
    })
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        dispatch(getEvents())
        return dispatch(getGuestList(event.eventId))
    })
    .catch((err) => {
        console.log(err);
    })   
}


export const leaveEvent = (event) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.delete(`/events/guest-list`, {
        event,
        sessionToken,
    })
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        dispatch(getEvents())
        return dispatch(getGuestList(event.eventId))
    })
    .catch((err) => {
        console.log(err);
    })   
}

export const resetEventForm = () => (dispatch) => {
    return dispatch({
        type: actionTypes.RESET_EVENT_FORM,
    })
}

export const changeEventsFilter = (filter = 'upcoming') => (dispatch) => {
    dispatch({
        type: actionTypes.CHANGE_EVENTS_FILTER,
        payload: {
            filter
        }
    })

    return dispatch(getEvents());
}