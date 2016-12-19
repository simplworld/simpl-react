'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StateActions = exports.SimplActions = exports.MessagesActions = undefined;

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

var _simpl = require('./simpl');

var _simpl2 = _interopRequireDefault(_simpl);

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An [FSA](https://github.com/acdlite/flux-standard-action)-compliant Redux
 * Action.
 * @typedef {function} ReduxAction
*/

var MessagesActions = exports.MessagesActions = _messages2.default;
var SimplActions = exports.SimplActions = _simpl2.default;
var StateActions = exports.StateActions = _state2.default;
/**
 * @namespace actions
 * @memberof Simpl
 */
exports.default = {
  messages: _messages2.default,
  simpl: _simpl2.default,
  state: _state2.default
};