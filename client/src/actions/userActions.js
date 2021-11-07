import ActionTypes from './ActionTypes';
import { setTokenHeader} from './api';
import {addError, removeError} from './errorActions';
import store from '../';

const logoutUser = () => {
    sessionStorage.clear();
    setTokenHeader(false);
    store.dispatch(setCurrentUser({}))
}

const setCurrentUser = user => {
    return {
        type: ActionTypes.SET_CURRENT_USER,
        payload: user
    }
}

export {setCurrentUser, logoutUser };