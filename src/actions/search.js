import { Platform, PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import get from 'lodash/get';
import find from 'lodash/find';

import * as actionTypes from '../constants/actionTypes';
import api from '../utils/api';
import authenticationSelector from '../selectors/authentication';
import friendsSelector from '../selectors/friends';

const getContacts = (query) => {
    return new Promise((resolve, reject) => {
        Contacts.getContactsMatchingString(query, (err, res) => {
            let matchedContacts = [];
            
            if(err){
                console.log(err);
                resolve({
                    suggestions: [],
                    contactsPhoneNumbers: [],
                })
            }
            else{
                matchedContacts = res;
            }
    
            const contactsPhoneNumbers = [];
            const suggestions = [];
            for(let i = 0; i < matchedContacts.length; i++){
                const phoneNumbers = get(matchedContacts[i], 'phoneNumbers', []);
                const mobilePhoneNumber = find(phoneNumbers, (number) => {return number.label === 'mobile'});
                if(mobilePhoneNumber){
                    let phoneNumberString = mobilePhoneNumber.number;
                    const phoneNumberObject = parsePhoneNumberFromString(phoneNumberString, 'US');
                    if(phoneNumberObject){
                        phoneNumberString = phoneNumberObject.number;
                    }
                    contactsPhoneNumbers.push(phoneNumberString);
    
                    let phone = get(matchedContacts[i], 'phoneNumber', '');
                    if(parsePhoneNumberFromString(phoneNumberString)){
                        phone = parsePhoneNumberFromString(phoneNumberString).formatNational();
                    }
    
                    let pic = 'https://flaker-images.s3.amazonaws.com/default-profile.png';
                    if(matchedContacts[i].hasThumbnail && matchedContacts[i].thumbnailPath !== ''){
                        pic = matchedContacts[i].thumbnailPath;
                    }
    
                    // We will do invites on the next build
                    // for now just grab phone numbers from matched contact to find user
                    // good enough for a new build.... 
                    // for invites we need a text message module
    
                    // suggestions.push({
                    //     pic, 
                    //     type: 'invite',
                    //     phone,
                    //     nameIdentifier: `${get(matchedContacts[i], 'givenName', '')} ${get(matchedContacts[i], 'familyName', '')}`,
                    // })
                }
            }
            resolve({
                suggestions,
                contactsPhoneNumbers
            })
        })
    })
}

// Ensure the call to this is debounced.
export const search = (query) => async (dispatch, getState) => {

    if(query.trim() === ''){
        return dispatch({
            type: actionTypes.UPDATED_SEARCH_SUGGESTIONS,
            payload: {
                suggestions: [],
            }
        })
    }

    let res = {
        suggestions: [],
        contactsPhoneNumbers: [],
    }
    if(Platform.OS === 'android'){
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                title: 'Contacts',
                message: 'Flaker would like to access your contacts to help find friends.',
            },
        );
        
        if(granted === PermissionsAndroid.RESULTS.GRANTED) {
            try{
                res = await getContacts(query);
            }
            catch(e){}
        }
    }
    else{
        try{
            res = await getContacts(query);
        }
        catch(e){}
    }

    const {suggestions, contactsPhoneNumbers} = res;
    const authenticationState = authenticationSelector(getState());
    const sessionToken = get(authenticationState, 'sessionToken', '');
    api.post(`/users/search/${sessionToken}`, {
        usernameQuery: query,
        phoneNumbers: contactsPhoneNumbers,
    })
    .then((apiResponse) => {
        if(get(apiResponse, 'message', '').toLowerCase() === 'invalid session.'){
            return dispatch({
                type: actionTypes.INVALID_SESSION,
            })
        }

        const matches = apiResponse.matches;
        for(let i = 0; i < matches.length; i++){
            let nameIdentifier = '';
            const displayName = get(matches[i], 'displayName', '');
            const username = get(matches[i], 'username', '');
            if(displayName === ''){
                nameIdentifier = username;
            }
            else{
                nameIdentifier = `${displayName} (${username})`;
            }

            let phone = get(matches[i], 'phoneNumber', '');
            if(parsePhoneNumberFromString(phone)){
                phone = parsePhoneNumberFromString(phone).formatNational();
            }

            suggestions.push({
                pic: get(matches[i], 'profilePic', 'https://flaker-images.s3.amazonaws.com/default-profile.png'),
                type: 'add',
                phone,
                nameIdentifier,
                userId: get(matches[i], 'userId', ''),
                key: get(matches[i], 'userId', ''),
            }) 
        }

        // Handle sent requests and existing friends
        // When we do invites we'd handle those as well
        const friendsState = friendsSelector(getState());
        const current = get(friendsState, 'current', []).map((curr) => curr.friendUserId);
        const sentRequests = get(friendsState, 'sentRequests', []).map((sent) => sent.userId);

        const suggestionsFiltered = suggestions.filter((suggestion) => {
            if(current.indexOf(suggestion.userId) !== -1){
                return false;
            }
            else if(sentRequests.indexOf(suggestion.userId) !== -1) {
                return false;
            }
            return true;
        })

        return dispatch({
            type: actionTypes.UPDATED_SEARCH_SUGGESTIONS,
            payload: {
                suggestions: suggestionsFiltered,
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })
}