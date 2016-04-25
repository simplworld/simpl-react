import { createStore, applyMiddleware, compose } from 'redux'
import { reduxReactRouter } from 'redux-router';

import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import createHistory from 'history/lib/createBrowserHistory'

const loggerMiddleware = createLogger()

const devTools = function() {
  return typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : applyMiddleware(loggerMiddleware)
}

const middlewares = [
  applyMiddleware(promiseMiddleware),
  applyMiddleware(thunkMiddleware),
  reduxReactRouter({ createHistory }),
]

export function finalCreateStoreFactory(NODE_ENV) {
  let _middlewares = [...middlewares]
  if (NODE_ENV !== "production") {
    _middlewares.push(devTools())
  }
  return compose(
    ..._middlewares
  )(createStore);
}


export default {
  finalCreateStoreFactory
}
