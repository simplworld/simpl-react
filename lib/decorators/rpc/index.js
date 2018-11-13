"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _calls = _interopRequireDefault(require("./calls"));

var _registers = _interopRequireDefault(require("./registers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace rpc
 * @memberof Simpl.decorators
 */
var _default = {
  calls: _calls.default,
  registers: _registers.default
};
exports.default = _default;