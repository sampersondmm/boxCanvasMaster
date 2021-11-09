import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import rootReducer from './reducers';
import {createStore, applyMiddleware, compose} from 'redux';
import { setCurrentUser } from './actions/userActions';
import { setTokenHeader } from './utils/apiUtils'
import thunk from 'redux-thunk';
import jwtDecode from 'jwt-decode';

import 'bootstrap/dist/css/bootstrap.min.css';
import './fontAwesome/css/all.css';

import './index.css';
import './css/index.css';
import './css/base.css';
import './css/panelButton.css';
import './css/canvas.css';
import './css/rightPanel.css';
import './css/leftPanel.css';
import './css/topPanel.css';
import './css/colorMenu.css';
import './css/colorPicker.css';
import './css/setupCanvas.css';
import './css/paletteMenu.css';
import './css/shapeMenu.css';
import './css/zoomMenu.css';
import './css/layerMenu.css';
import './css/layerMenu2.css';
import './css/canvasList.css';

import 'semantic-ui-css/semantic.min.css';

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    )
  );

if(sessionStorage.jwtToken) {
    setTokenHeader(sessionStorage.jwtToken);
    //prevent tampering of jwtToken key in sessionStorage
    try {
        store.dispatch(setCurrentUser(jwtDecode(sessionStorage.jwtToken)))
    } catch(err) {
        store.dispatch(setCurrentUser({}))
    }   
}

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
, document.getElementById('root'));

export default store;

