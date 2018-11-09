"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.recyleStateAction = void 0;

var _reduxActions = require("redux-actions");

var recyleStateAction = (0, _reduxActions.createAction)('simpl/RECYCLE_STATE');
/**
 * @namespace state
 * @memberof Simpl.actions
 */

exports.recyleStateAction = recyleStateAction;
var _default = {
  recyleStateAction: recyleStateAction
};
exports.default = _default;