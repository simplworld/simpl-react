'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _calls = require('./calls');

var _calls2 = _interopRequireDefault(_calls);

var _registers = require('./registers');

var _registers2 = _interopRequireDefault(_registers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace rpc
 * @memberof Simpl.decorators
 */
exports.default = {
  calls: _calls2.default,
  registers: _registers2.default
};