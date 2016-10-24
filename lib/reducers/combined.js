'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.routerReducers = routerReducers;
exports.wampReducers = wampReducers;
exports.simplReducers = simplReducers;

var _redux = require('redux');

var _reduxRouter = require('redux-router');

var _simpl = require('./simpl');

var _simpl2 = _interopRequireDefault(_simpl);

var _wamp = require('./wamp');

var _wamp2 = _interopRequireDefault(_wamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routerReducers(reducers) {
  var combined = _extends({}, reducers, {
    router: _reduxRouter.routerStateReducer
  });
  return (0, _redux.combineReducers)(combined);
}

function wampReducers(reducers) {
  var combined = _extends({}, reducers, {
    router: _reduxRouter.routerStateReducer,
    wamp: _wamp2.default
  });
  return (0, _redux.combineReducers)(combined);
}

function simplReducers(reducers) {
  var combined = _extends({}, reducers, {
    router: _reduxRouter.routerStateReducer,
    simpl: _simpl2.default,
    wamp: _wamp2.default
  });
  return (0, _redux.combineReducers)(combined);
}

exports.default = {
  router: routerReducers,
  simpl: simplReducers,
  wamp: wampReducers
};