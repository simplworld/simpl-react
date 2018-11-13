"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RPCCaller = _interopRequireDefault(require("./RPCCaller.react"));

var _TopicPublisher = _interopRequireDefault(require("./TopicPublisher.react"));

var _TopicSubscriber = _interopRequireDefault(require("./TopicSubscriber.react"));

var _Progress = _interopRequireDefault(require("./Progress.react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A React Component.
 * @typedef {object} ReactElement
 */

/**
 * @namespace components
 * @memberof Simpl
 */
var _default = {
  RPCCaller: _RPCCaller.default,
  TopicPublisher: _TopicPublisher.default,
  TopicSubscriber: _TopicSubscriber.default,
  Progress: _Progress.default
};
exports.default = _default;