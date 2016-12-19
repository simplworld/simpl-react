'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _forms = require('./forms');

var _forms2 = _interopRequireDefault(_forms);

var _pubsub = require('./pubsub');

var _pubsub2 = _interopRequireDefault(_pubsub);

var _rpc = require('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _simpl = require('./simpl');

var _simpl2 = _interopRequireDefault(_simpl);

var _wamp = require('./wamp');

var _wamp2 = _interopRequireDefault(_wamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace decorators
 * @memberof Simpl
 */
exports.default = {
  forms: _forms2.default,
  pubsub: _pubsub2.default,
  rpc: _rpc2.default,
  simpl: _simpl2.default,
  wamp: _wamp2.default
};