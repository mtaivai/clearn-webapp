import React from 'react'
import { render } from 'react-dom'

import { createStore, compose } from 'redux'

import thunkMiddleware from 'redux-thunk'
import { applyMiddleware } from 'redux'
//import promiseMiddleware from 'redux-promise';
import statefulPromiseMiddleware from './stateful-promise-middleware'

import { persistState } from 'redux-devtools'

import { Provider } from 'react-redux'


import appReducer from './reducers'
import App from './components/App'
import DevTools from './containers/DevTools'


const middleware = applyMiddleware(
    thunkMiddleware,
    statefulPromiseMiddleware
);

function getSessionKey () {
    const matches = window.location.href.match(/[?&]debug=([^&#]+)\b/)
    return (matches && matches.length > 0)
        ? matches[1]
        : null
}

const enhancer = compose(
    middleware,
    DevTools.instrument(),
    persistState(getSessionKey()));

const initialState = {};

let store = createStore(appReducer, initialState, enhancer);

// TODO we can have this as an configuration option:
require('./sticky-footer.css');
//require('./fixed-header.css');
//document.body.parentNode.className = "sticky-footer";

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);