'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

var _simpl = require('./simpl');

var _simpl2 = _interopRequireDefault(_simpl);

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {function} ReduxAction
*/

/**
 * @namespace actions
 * @memberof Simpl
 */
exports.default = {
  messages: _messages2.default,
  simpl: _simpl2.default,
  state: _state2.default
};