"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pubsub = _interopRequireDefault(require("./pubsub"));

var _rpc = _interopRequireDefault(require("./rpc"));

var _simpl = _interopRequireDefault(require("./simpl"));

var _wamp = _interopRequireDefault(require("./wamp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace decorators
 * @memberof Simpl
 */
var _default = {
  pubsub: _pubsub.default,
  rpc: _rpc.default,
  simpl: _simpl.default,
  wamp: _wamp.default
};
exports.default = _default;