import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';

import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import createHistory from 'history/lib/createBrowserHistory';

const loggerMiddleware = createLogger();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const defaultMiddlewares = [
  applyMiddleware(promiseMiddleware),
  applyMiddleware(thunkMiddleware),
  reduxReactRouter({ createHistory }),
];

export function finalCreateStoreFactory(NODE_ENV) {
  const middlewares = [...defaultMiddlewares];
  if (NODE_ENV !== 'production' && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'undefined') {
    middlewares.push(applyMiddleware(loggerMiddleware));
  }
  return composeEnhancers(
    ...middlewares
  )(createStore);
}


export default {
  finalCreateStoreFactory,
};
