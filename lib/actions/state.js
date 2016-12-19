'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recyleStateAction = undefined;

var _actions = require('../utils/actions');

var recyleStateAction = exports.recyleStateAction = (0, _actions.createNamedAction)('simpl/RECYCLE_STATE');

/**
 * @namespace state
 * @memberof Simpl.actions
 */
exports.default = {
  recyleStateAction: recyleStateAction
};