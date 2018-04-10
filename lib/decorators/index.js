'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pubsub = require('./pubsub');

var _pubsub2 = _interopRequireDefault(_pubsub);

var _rpc = require('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _simpl = require('./simpl');

var _simpl2 = _interopRequireDefault(_simpl);

var _simpler = require('./simpler');

var _simpler2 = _interopRequireDefault(_simpler);

var _wamp = require('./wamp');

var _wamp2 = _interopRequireDefault(_wamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace decorators
 * @memberof Simpl
 */
exports.default = {
  pubsub: _pubsub2.default,
  rpc: _rpc2.default,
  simpl: _simpl2.default,
  simpler: _simpler2.default,
  wamp: _wamp2.default
};