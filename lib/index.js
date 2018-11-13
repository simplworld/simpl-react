"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _actions = _interopRequireDefault(require("./actions"));

var _autobahn = _interopRequireDefault(require("./autobahn"));

var _components = _interopRequireDefault(require("./components"));

var _decorators = _interopRequireDefault(require("./decorators"));

var _reducers = _interopRequireDefault(require("./reducers"));

var _stores = _interopRequireDefault(require("./stores"));

var _utils = _interopRequireDefault(require("./utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module Simpl
 * @namespace Simpl
 */
var _default = {
  actions: _actions.default,
  autobahn: _autobahn.default,
  components: _components.default,
  decorators: _decorators.default,
  reducers: _reducers.default,
  stores: _stores.default,
  utils: _utils.default
};
exports.default = _default;