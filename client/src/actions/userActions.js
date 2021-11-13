import ActionTypes from './ActionTypes';
import { setTokenHeader} from '../utils/apiUtils';
import {addError, removeError} from './errorActions';
import store from '../';

const logoutUser = () => {
    sessionStorage.clear();
    setTokenHeader(false);
    return {
        type: ActionTypes.SET_CURRENT_USER,
        payload: {}
    }
}

const setCurrentUser = user => {
    return {
        type: ActionTypes.SET_CURRENT_USER,
        payload: user
    }
}

export {setCurrentUser, logoutUser };