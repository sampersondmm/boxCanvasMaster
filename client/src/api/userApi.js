import { apiCall, setTokenHeader } from '../utils/apiUtils';
import { setCurrentUser } from '../actions/userActions';
import { removeError, addError } from '../actions/errorActions'
import store from '../index'

class UserAPI {
    loginUser = async (data) => {
        try {
            const response = await apiCall({
                method: 'post', 
                url: '/api/auth/signin', 
                data
            });
            sessionStorage.setItem('jwtToken', response.token);
            setTokenHeader(response.token);
            store.dispatch(setCurrentUser(response.user))

        } catch (error) {
            const message = error && error.data ?
                error.data.error.message : 
                'Something went wrong'
            throw new Error(message);
        }
    }

    createNewUser = async (data) => {
        try {
            const response = await apiCall({
                method: 'post', 
                url: '/api/auth/signup', 
                data
            });
            sessionStorage.setItem('jwtToken', response.token);
            setTokenHeader(response.token);
            store.dispatch(setCurrentUser(response.user))

        } catch (error) {
            const message = error.response.data.error.message;
            return message;
        }
    }
}

export default UserAPI