'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.finalCreateStoreFactory = finalCreateStoreFactory;

var _redux = require('redux');

var _reduxRouter = require('redux-router');

var _reduxPromise = require('redux-promise');

var _reduxPromise2 = _interopRequireDefault(_reduxPromise);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _createBrowserHistory = require('history/lib/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var loggerMiddleware = (0, _reduxLogger2.default)();

var devTools = function devTools() {
  // eslint-disable-next-line max-len
  return (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : (0, _redux.applyMiddleware)(loggerMiddleware);
};

var defaultMiddlewares = [(0, _redux.applyMiddleware)(_reduxPromise2.default), (0, _redux.applyMiddleware)(_reduxThunk2.default), (0, _reduxRouter.reduxReactRouter)({ createHistory: _createBrowserHistory2.default })];

function finalCreateStoreFactory(NODE_ENV) {
  var middlewares = [].concat(defaultMiddlewares);
  if (NODE_ENV !== 'production') {
    middlewares.push(devTools());
  }
  return _redux.compose.apply(undefined, _toConsumableArray(middlewares))(_redux.createStore);
}

exports.default = {
  finalCreateStoreFactory: finalCreateStoreFactory
};