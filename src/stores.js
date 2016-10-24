import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';

import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import createHistory from 'history/lib/createBrowserHistory';

const loggerMiddleware = createLogger();

const devTools = function devTools() {
  // eslint-disable-next-line max-len
  return typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : applyMiddleware(loggerMiddleware);
};

const defaultMiddlewares = [
  applyMiddleware(promiseMiddleware),
  applyMiddleware(thunkMiddleware),
  reduxReactRouter({ createHistory }),
];

export function finalCreateStoreFactory(NODE_ENV) {
  const middlewares = [...defaultMiddlewares];
  if (NODE_ENV !== 'production') {
    middlewares.push(devTools());
  }
  return compose(
    ...middlewares
  )(createStore);
}


export default {
  finalCreateStoreFactory,
};
