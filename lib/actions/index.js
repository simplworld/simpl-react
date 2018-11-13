"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StateActions = exports.SimplActions = exports.MessagesActions = void 0;

var _messages = _interopRequireDefault(require("./messages"));

var _simpl = _interopRequireDefault(require("./simpl"));

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An [FSA](https://github.com/acdlite/flux-standard-action)-compliant Redux
 * Action.
 * @typedef {function} ReduxAction
*/
var MessagesActions = _messages.default;
exports.MessagesActions = MessagesActions;
var SimplActions = _simpl.default;
exports.SimplActions = SimplActions;
var StateActions = _state.default;
/**
 * @namespace actions
 * @memberof Simpl
 */

exports.StateActions = StateActions;
var _default = {
  messages: _messages.default,
  simpl: _simpl.default,
  state: _state.default
};
exports.default = _default;