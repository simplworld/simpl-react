'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.finalCreateStoreFactory = finalCreateStoreFactory;

var _redux = require('redux');

var _reduxRouter = require('redux-router');

var _reduxPromise = require('redux-promise');

var _reduxPromise2 = _interopRequireDefault(_reduxPromise);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * @namespace stores
                                                                                                                                                                                                     * @memberof Simpl
                                                                                                                                                                                                     */


var loggerMiddleware = (0, _reduxLogger2.default)();

// eslint-disable-next-line no-underscore-dangle
var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;

var defaultMiddlewares = [(0, _redux.applyMiddleware)(_reduxPromise2.default), (0, _redux.applyMiddleware)(_reduxThunk2.default), (0, _reduxRouter.reduxReactRouter)({ createHistory: _createBrowserHistory2.default })];

/**
 * Adds promise, thunk, router and dev tools middlewares to your store
 *
 * @param      {string}  NODE_ENV  The node env
 * @return     {function}  a `createStore` factory
 */
function finalCreateStoreFactory(NODE_ENV) {
  var middlewares = [].concat(defaultMiddlewares);
  if (NODE_ENV !== 'production'
  // eslint-disable-next-line no-underscore-dangle
  && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'undefined') {
    middlewares.push((0, _redux.applyMiddleware)(loggerMiddleware));
  }
  return composeEnhancers.apply(undefined, _toConsumableArray(middlewares))(_redux.createStore);
}

exports.default = {
  finalCreateStoreFactory: finalCreateStoreFactory
};