"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _collections = _interopRequireDefault(require("./collections"));

var _reducers = _interopRequireDefault(require("./reducers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace utils
 * @memberof Simpl
 */
var _default = {
  collections: _collections.default,
  reducers: _reducers.default
};
exports.default = _default;