"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _publishes = _interopRequireDefault(require("./publishes"));

var _subscribes = _interopRequireDefault(require("./subscribes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace pubsub
 * @memberof Simpl.decorators
 */
var _default = {
  publishes: _publishes.default,
  subscribes: _subscribes.default
};
exports.default = _default;