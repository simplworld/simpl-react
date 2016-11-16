/**
 * @namespace stores
 * @memberof Simpl
 */
import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';

import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import createHistory from 'history/lib/createBrowserHistory';

console.info(createHistory);

const loggerMiddleware = createLogger();

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const defaultMiddlewares = [
  applyMiddleware(promiseMiddleware),
  applyMiddleware(thunkMiddleware),
  reduxReactRouter({ createHistory }),
];

/**
 * Adds promise, thunk, router and dev tools middlewares to your store
 *
 * @param      {string}  NODE_ENV  The node env
 * @return     {function}  a `createStore` factory
 */
export function finalCreateStoreFactory(NODE_ENV) {
  const middlewares = [...defaultMiddlewares];
  if (NODE_ENV !== 'production'
    // eslint-disable-next-line no-underscore-dangle
    && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'undefined') {
    middlewares.push(applyMiddleware(loggerMiddleware));
  }
  return composeEnhancers(
    ...middlewares
  )(createStore);
}


export default {
  finalCreateStoreFactory,
};
