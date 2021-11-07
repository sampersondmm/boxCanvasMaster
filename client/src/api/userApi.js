import { apiCall, setTokenHeader } from '../actions/api';
import { setCurrentUser } from '../actions/userActions';
import { removeError, addError } from '../actions/errorActions'
import store from '../index'

class UserAPI {
    loginUser = async (data) => {
        try {
            const response = await apiCall('post', '/api/auth/signin', data);
            sessionStorage.setItem('jwtToken', response.token);
            setTokenHeader(response.token);
            store.dispatch(setCurrentUser(response.user))
            store.dispatch(removeError());
        } catch (error) {
            const message = error.response.data.error.message;
            store.dispatch(addError(message))
        }
    }

    createNewUser = async (data) => {
        try {
            const response = await apiCall('post', '/api/auth/signup', data);
            sessionStorage.setItem('jwtToken', response.token);
            setTokenHeader(response.token);
            store.dispatch(setCurrentUser(response.user))
            store.dispatch(removeError());
        } catch (error) {
            const message = error.response.data.error.message;
            store.dispatch(addError(message))
        }
    }
}

export default UserAPI