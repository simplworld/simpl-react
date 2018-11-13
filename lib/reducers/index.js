"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.simplReducer = exports.messagesReducer = exports.combinedReducer = void 0;

var _combined = _interopRequireDefault(require("./combined"));

var _messages = _interopRequireDefault(require("./messages"));

var _simpl = _interopRequireDefault(require("./simpl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combinedReducer = _combined.default;
exports.combinedReducer = combinedReducer;
var messagesReducer = _messages.default;
exports.messagesReducer = messagesReducer;
var simplReducer = _simpl.default;
/**
 * @namespace reducers
 * @memberof Simpl
 */

exports.simplReducer = simplReducer;
var _default = {
  combined: _combined.default,
  messages: _messages.default,
  simpl: _simpl.default
};
exports.default = _default;