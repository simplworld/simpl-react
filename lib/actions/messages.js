'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMessage = exports.appendMessage = undefined;

var _actions = require('../utils/actions');

/*
 * action creators
 */

var appendMessage = exports.appendMessage = (0, _actions.createNamedAction)('MESSAGE_APPEND');
var updateMessage = exports.updateMessage = (0, _actions.createNamedAction)('MESSAGE_UPDATE');

/**
 * @namespace messages
 * @memberof Simpl.actions
 */
exports.default = {
  appendMessage: appendMessage,
  updateMessage: updateMessage
};