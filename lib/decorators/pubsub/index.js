'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _publishes = require('./publishes');

var _publishes2 = _interopRequireDefault(_publishes);

var _subscribes = require('./subscribes');

var _subscribes2 = _interopRequireDefault(_subscribes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace pubsub
 * @memberof Simpl.decorators
 */
exports.default = {
  publishes: _publishes2.default,
  subscribes: _subscribes2.default
};