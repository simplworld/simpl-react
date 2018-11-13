"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.updateMessage = exports.appendMessage = void 0;

var _reduxActions = require("redux-actions");

/*
 * action creators
 */
var appendMessage = (0, _reduxActions.createAction)('simpl/MESSAGE_APPEND');
exports.appendMessage = appendMessage;
var updateMessage = (0, _reduxActions.createAction)('simpl/MESSAGE_UPDATE');
/**
 * @namespace messages
 * @memberof Simpl.actions
 */

exports.updateMessage = updateMessage;
var _default = {
  appendMessage: appendMessage,
  updateMessage: updateMessage
};
exports.default = _default;