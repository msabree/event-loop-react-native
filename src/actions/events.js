import get from 'lodash/get';
import * as actionTypes from '../constants/actionTypes';
import formsSelector from '../selectors/forms';
import authenticationSelector from '../selectors/authentication';
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
        alert('Use the autocomplete to select an address or specific location.');
    }
    else if(title === ''){
        alert('Enter a title for this event.');
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
                alert('Event has been created!');
            }
            else{
                alert('Unable to create event. Please try again later.');
            }
    
            dispatch(getEvents())
        })
        .catch((err) => {
            console.log(err);
        })
    }
}

export const deleteEvent = (eventId) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.delete(`/events/${sessionToken}/${eventId}`)
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

export const getEvents = () => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

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
                apiResponse
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

export const joinEvent = (eventId) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.post(`/events/guest-list`, {
        eventId,
        sessionToken,
    })
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        // update the list again
        return dispatch(getGuestList(eventId))
    })
    .catch((err) => {
        console.log(err);
    })   
}


export const leaveEvent = (eventId) => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');

    api.delete(`/events/guest-list`, {
        eventId,
        sessionToken,
    })
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }
        // update the list again
        return dispatch(getGuestList(eventId))
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