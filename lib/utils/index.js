'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _collections = require('./collections');

var _collections2 = _interopRequireDefault(_collections);

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace utils
 * @memberof Simpl
 */
exports.default = {
  actions: _actions2.default,
  collections: _collections2.default,
  reducers: _reducers2.default
};