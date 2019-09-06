import AsyncStorage from '@react-native-community/async-storage';
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import get from 'lodash/get';

import * as actionTypes from '../constants/actionTypes';
import * as storageKeys from '../constants/storageKeys';
import api from '../utils/api';
import authenticationSelector from '../selectors/authentication';

export const removeSession = () => async (dispatch) => {
    try{
        await AsyncStorage.removeItem(storageKeys.SESSION_TOKEN);
    }
    catch(e){
        console.log('Error removing session token. This is problematic.... Attempting to write a null value');
        console.log(e);

        try{
            await AsyncStorage.setItem(storageKeys.SESSION_TOKEN, null);
        }
        catch(e){
            console.log('Fatal error... Unable to delete bad session. User may have to reinstall.');
            console.log(e)
        }
    }

    dispatch({
        type: actionTypes.CLEARED_INVALID_SESSION,
    })
}

export const getSessionTokenFromLocalStorage = () => async (dispatch) => {
    let sessionToken = null;
    try{
        sessionToken = await AsyncStorage.getItem(storageKeys.SESSION_TOKEN);
    }
    catch(e){
        console.log('Error fetching session token from storage.');
        console.log(e);
    }
    
    return dispatch({
        type: actionTypes.GET_SESSION_TOKEN_FROM_LOCAL_STORAGE,
        payload: {
            sessionToken: '26863360-b8a3-11e9-873e-eb2226ce8f3f',
        }
    })
}

export const changedPhoneNumberText = (phoneNumber) => async (dispatch) => {
    return dispatch({
        type: actionTypes.CHANGED_PHONE_NUMBER_TEXT,
        payload: {
            phoneNumber
        }
    })
}

export const changedVerificationCodeText = (verificationCode) => async (dispatch) => {
    return dispatch({
        type: actionTypes.CHANGED_VERIFICATION_CODE_TEXT,
        payload: {
            verificationCode
        }
    })
}

export const requestVerificationCode = () => async (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const phoneNumber = get(authenticationState, 'phoneNumber', '');
    const phoneNumberParsed = parsePhoneNumberFromString(phoneNumber, 'US');
    if(phoneNumber && phoneNumberParsed){
        console.log(phoneNumber, phoneNumberParsed)
        api.post(`/users/verification/${phoneNumberParsed.number}`)
        .then((apiResponse) => {
            return dispatch({
                type: actionTypes.REQUEST_VERIFICATION_CODE,
                payload: {
                    apiResponse,
                }
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }
    else{
        alert('Incorrect phone number format. Please try again. ');
    }
}

export const verifyPhoneNumber = () => (dispatch, getState) => {
    const authenticationState = authenticationSelector(getState());
    const verificationCode = get(authenticationState, 'verificationCode', '');
    const phoneNumber = get(authenticationState, 'phoneNumber', '');
    const phoneNumberParsed = parsePhoneNumberFromString(phoneNumber, 'US');

    if(verificationCode.trim() === ''){
        alert('Please enter the verification code.');
    }
    else{
        api.get(`/users/verification/${phoneNumberParsed.number}/${verificationCode}`)
        .then((apiResponse) => {
            const success = get(apiResponse, 'success', false);
            const sessionToken = get(apiResponse, 'sessionToken', '');

            if(success === true && sessionToken !== ''){
                // PERSIST SESSION INDEFINATELY? 
                // MAYBE A WEEK?
                // WE CAN ADD META DATA WITH DATES AN EXPIRE AFTER A SET PERIOD (if we want)
                try{
                    AsyncStorage.setItem(storageKeys.SESSION_TOKEN, sessionToken)
                    .then(() => {
                        return dispatch({
                            type: actionTypes.VERIFY_PHONE_NUMBER,
                            payload: {
                                apiResponse,
                            }
                        })
                    })
                }
                catch(e){
                    throw new Error(e)
                }
            }
            else{
                return dispatch({
                    type: actionTypes.VERIFY_PHONE_NUMBER,
                    payload: {
                        apiResponse,
                    }
                })
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }
}