"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reduxCreateReducer = require("redux-create-reducer");

var _reduxRecycle = _interopRequireDefault(require("redux-recycle"));

var _createReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var MessageActions = require('../actions/messages');

var StateActions = require('../actions/state');

var initial = {};

var Message = function Message(payload) {
  return {
    args: payload[0],
    kwargs: payload[1],
    details: payload[2]
  };
};

var messages = (0, _reduxRecycle.default)((0, _reduxCreateReducer.createReducer)(initial, (_createReducer = {}, _defineProperty(_createReducer, MessageActions.appendMessage, function (state, action) {
  var payload = action.payload;
  var variable = payload.variable; // eslint-disable-next-line new-cap

  var message = Message(payload);

  var newVar = _toConsumableArray(state[variable] || []).concat([message]);

  return _extends({}, state, _defineProperty({}, variable, newVar));
}), _defineProperty(_createReducer, MessageActions.updateMessage, function (state, action) {
  var payload = action.payload;
  var variable = payload.variable; // eslint-disable-next-line new-cap

  var message = Message(payload);
  return _extends({}, state, _defineProperty({}, variable, message));
}), _createReducer)), "".concat(StateActions.recycleState));
var _default = messages;
exports.default = _default;