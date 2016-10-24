'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _components = require('./components');

var _components2 = _interopRequireDefault(_components);

var _decorators = require('./decorators');

var _decorators2 = _interopRequireDefault(_decorators);

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _stores = require('./stores');

var _stores2 = _interopRequireDefault(_stores);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _autobahnReact = require('autobahn-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module Simpl
 * @namespace Simpl
 */
exports.default = {
  AutobahnReact: _autobahnReact.Autobahn,
  actions: _actions2.default,
  components: _components2.default,
  decorators: _decorators2.default,
  reducers: _reducers2.default,
  stores: _stores2.default,
  utils: _utils2.default
};