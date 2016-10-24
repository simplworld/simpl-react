'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wampReducer = exports.simplReducer = exports.messagesReducer = exports.combinedReducer = undefined;

var _combined = require('./combined');

var _combined2 = _interopRequireDefault(_combined);

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

var _simpl = require('./simpl');

var _simpl2 = _interopRequireDefault(_simpl);

var _wamp = require('./wamp');

var _wamp2 = _interopRequireDefault(_wamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace reducers
 * @memberof Simpl
 */

var combinedReducer = exports.combinedReducer = _combined2.default;
var messagesReducer = exports.messagesReducer = _messages2.default;
var simplReducer = exports.simplReducer = _simpl2.default;
var wampReducer = exports.wampReducer = _wamp2.default;

exports.default = {
  combined: _combined2.default,
  messages: _messages2.default,
  simpl: _simpl2.default,
  wamp: _wamp2.default
};