'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recyleStateAction = undefined;

var _reduxActions = require('redux-actions');

var recyleStateAction = exports.recyleStateAction = (0, _reduxActions.createAction)('simpl/RECYCLE_STATE');

/**
 * @namespace state
 * @memberof Simpl.actions
 */
exports.default = {
  recyleStateAction: recyleStateAction
};