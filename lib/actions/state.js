'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recycleState = undefined;

var _actions = require('../utils/actions');

var recycleState = exports.recycleState = (0, _actions.createNamedAction)('RECYCLE_STATE');

/**
 * @namespace state
 * @memberof Simpl.actions
 */
exports.default = {
  recycleState: recycleState
};