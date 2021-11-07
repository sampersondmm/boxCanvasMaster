import {combineReducers} from 'redux';
import canvas from './canvasReducer';
import error from './errorReducer';
import currentUser from './userReducer';

const rootReducer = combineReducers({
    canvas,
    error,
    currentUser
})


export default rootReducer;