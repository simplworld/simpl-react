'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createReducer;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reduxCreateReducer = require('redux-create-reducer');

var _reduxRecycle = require('redux-recycle');

var _reduxRecycle2 = _interopRequireDefault(_reduxRecycle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var MessageActions = require('../actions/messages');
var StateActions = require('../actions/state');

var initial = {};

var Message = function Message(payload) {
  return { args: payload[0], kwargs: payload[1], details: payload[2] };
};

var messages = (0, _reduxRecycle2.default)((0, _reduxCreateReducer.createReducer)(initial, (_createReducer = {}, _defineProperty(_createReducer, MessageActions.appendMessage, function (state, action) {
  var payload = action.payload;
  var variable = payload.variable;
  // eslint-disable-next-line new-cap
  var message = Message(payload);

  var newVar = [].concat(_toConsumableArray(state[variable] || []), [message]);

  return _extends({}, state, _defineProperty({}, variable, newVar));
}), _defineProperty(_createReducer, MessageActions.updateMessage, function (state, action) {
  var payload = action.payload;
  var variable = payload.variable;
  // eslint-disable-next-line new-cap
  var message = Message(payload);

  return _extends({}, state, _defineProperty({}, variable, message));
}), _createReducer)), '' + StateActions.recycleState);

exports.default = messages;