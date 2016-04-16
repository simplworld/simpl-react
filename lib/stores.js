import { createStore, applyMiddleware, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import { syncHistory } from 'redux-simple-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

const loggerMiddleware = createLogger()

export const browserHistory = createBrowserHistory()
export const reduxRouterMiddleware = syncHistory(browserHistory)

let devTools = function() {
  return typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : applyMiddleware(loggerMiddleware)
}

let middlewares;

if (process.env.NODE_ENV === "development") {
  middlewares = [
    applyMiddleware(promiseMiddleware),
    applyMiddleware(thunkMiddleware),
    applyMiddleware(reduxRouterMiddleware),
    devTools()
  ]
} else {
  middlewares = [
    applyMiddleware(promiseMiddleware),
    applyMiddleware(thunkMiddleware),
    applyMiddleware(reduxRouterMiddleware),
  ];
}

export const finalCreateStore = compose(
  ...middlewares
)(createStore);


export default {
  browserHistory,
  finalCreateStore
}