"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.finalCreateStoreFactory = finalCreateStoreFactory;
exports.default = void 0;

var _redux = require("redux");

var _reduxRouter = require("redux-router");

var _reduxPromise = _interopRequireDefault(require("redux-promise"));

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _reduxLogger = _interopRequireDefault(require("redux-logger"));

var _createBrowserHistory = _interopRequireDefault(require("history/lib/createBrowserHistory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var loggerMiddleware = (0, _reduxLogger.default)(); // eslint-disable-next-line no-underscore-dangle

var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;
var defaultMiddlewares = [(0, _redux.applyMiddleware)(_reduxPromise.default), (0, _redux.applyMiddleware)(_reduxThunk.default), (0, _reduxRouter.reduxReactRouter)({
  createHistory: _createBrowserHistory.default
})];
/**
 * Adds promise, thunk, router and dev tools middlewares to your store
 *
 * @param      {string}  NODE_ENV  The node env
 * @return     {function}  a `createStore` factory
 */

function finalCreateStoreFactory(NODE_ENV) {
  var middlewares = defaultMiddlewares.concat();

  if (NODE_ENV !== 'production' // eslint-disable-next-line no-underscore-dangle
  && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'undefined') {
    middlewares.push((0, _redux.applyMiddleware)(loggerMiddleware));
  }

  return composeEnhancers.apply(void 0, _toConsumableArray(middlewares))(_redux.createStore);
}

var _default = {
  finalCreateStoreFactory: finalCreateStoreFactory
};
exports.default = _default;