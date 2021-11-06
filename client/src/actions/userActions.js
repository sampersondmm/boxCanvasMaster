import ActionTypes from './ActionTypes';
import {apiCall, setTokenHeader} from './api';
import {addError, removeError} from './errorActions';


const authorizeUser = async (type, userData) => {
    try {
        await apiCall(
            'post',
            `/api/auth/${type}`,
            userData

        )
    } catch (error) {
        dispatch(addError(err.message))
    }
}

const setAuthorizationToken = token => {
    setTokenHeader(token)
}

const logoutUser = () => {
    return dispatch => {
        sessionStorage.clear();
        setAuthorizationToken(false);
        dispatch(setCurrentUser({}))
    }
}

const setCurrentUser = user => {
    return {
        type: ActionTypes.SET_CURRENT_USER,
        payload: user
    }
}

export {setCurrentUser, authorizeUser, logoutUser, setAuthorizationToken};