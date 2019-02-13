"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.popError = exports.getCurrentRunUserInfo = exports.getRunUserScenarios = exports.showGenericError = exports.getRoles = exports.getPhases = exports.getCurrentRunPhase = exports.disconnectedScope = exports.connectedScope = exports.updateScope = exports.setConnectionStatus = exports.getRunUsers = exports.getDataTree = exports.removeChild = exports.addChild = exports.removeTopic = exports.addTopic = void 0;

var _reduxActions = require("redux-actions");

var _autobahn = _interopRequireDefault(require("../autobahn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * action creators
 */
var addTopic = (0, _reduxActions.createAction)('simpl/TOPIC_ADD');
exports.addTopic = addTopic;
var removeTopic = (0, _reduxActions.createAction)('simpl/TOPIC_REMOVE');
exports.removeTopic = removeTopic;
var addChild = (0, _reduxActions.createAction)('simpl/CHILD_ADD');
exports.addChild = addChild;
var removeChild = (0, _reduxActions.createAction)('simpl/CHILD_REMOVE');
/**
 * Given a scope's topic, returns a recursive representation of that scope and
 * its children.
 * @function
 * @memberof Simpl.actions.simpl
 * @param {string} scope - the scope's topic
 * @param {array} exclude - names of resource types to exclude
 * @returns {NamedReduxAction}
 */

exports.removeChild = removeChild;
var getDataTree = (0, _reduxActions.createAction)('simpl/DATATREE_GET', function (scope, exclude) {
  return _autobahn.default.call("".concat(scope, ".get_scope_tree"), [exclude]);
});
/**
 * Given a scope's topic, returns a list of runusers that belong to the scope.
 * @function
 * @memberof Simpl.actions.simpl
 * @param {string} scope - the scope's topic
 * @returns {NamedReduxAction}
 */

exports.getDataTree = getDataTree;
var getRunUsers = (0, _reduxActions.createAction)('simpl/RUNUSERS_GET', function (scope, exclude) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return _autobahn.default.call("".concat(scope, ".get_active_runusers"), args);
});
/**
 * Set the connection status on the store.
 * @function
 * @memberof Simpl.actions.simpl
 * @param {symbol} status - the connection status.
 * @returns {NamedReduxAction}
 */

exports.getRunUsers = getRunUsers;
var setConnectionStatus = (0, _reduxActions.createAction)('simpl/SET_CONNECTION_STATUS');
/**
 * Update the scope in the redux state with the received payload.
 *
 * The payload
 * must contain a `resource_name` property (eg: `'decision'`, `'result'`, etc.)
 * and a `pk` property, to properly identify the correct scope to be updated.
 * @function
 * @memberof Simpl.actions.simpl
 * @param {object} scope - the scope's JSON representation
 * @returns {NamedReduxAction}
 */

exports.setConnectionStatus = setConnectionStatus;
var updateScope = (0, _reduxActions.createAction)('simpl/SCOPE_UPDATE');
/**
 * Dispatched when the client is ready to listen to a specific scope.
 *
 * @function
 * @memberof Simpl.actions.simpl
 * @param {string} scope - the scope's topic
 * @returns {NamedReduxAction}
 */

exports.updateScope = updateScope;
var connectedScope = (0, _reduxActions.createAction)('simpl/SCOPE_CONNECTED', function (scope) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return _autobahn.default.publish("".concat(scope, ".connected"), args);
});
/**
 * Dispatched when the client gets disconnected and can't listen to the scope.
 *
 * @function
 * @memberof Simpl.actions.simpl
 * @param {string} topic - the scope's topic
 * @returns {NamedReduxAction}
 */

exports.connectedScope = connectedScope;
var disconnectedScope = (0, _reduxActions.createAction)('simpl/SCOPE_DISCONNECTED', function (topic) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return _autobahn.default.publish("".concat(topic, ".disconnected"), args);
});
exports.disconnectedScope = disconnectedScope;
var getCurrentRunPhase = (0, _reduxActions.createAction)('simpl/CURRENT_RUN', function (topic) {
  for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  return _autobahn.default.call("".concat(topic, ".get_current_run_and_phase"), args);
});
exports.getCurrentRunPhase = getCurrentRunPhase;
var getPhases = (0, _reduxActions.createAction)('simpl/GET_PHASES', function (topic) {
  for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  return _autobahn.default.call("".concat(topic, ".get_phases"), args);
});
exports.getPhases = getPhases;
var getRoles = (0, _reduxActions.createAction)('simpl/GET_ROLES', function (topic) {
  for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    args[_key6 - 1] = arguments[_key6];
  }

  return _autobahn.default.call("".concat(topic, ".get_roles"), args);
});
exports.getRoles = getRoles;
var showGenericError = (0, _reduxActions.createAction)('simpl/SHOW_GENERIC_ERROR');
/**
 * Populate simpl.scenario with current runuser's scenarios.
 *
 * @function
 * @memberof Simpl.actions.simpl
 * @param {String} topic - The runuser's topic.
 * @returns {NamedReduxAction}
 */

exports.showGenericError = showGenericError;
var getRunUserScenarios = (0, _reduxActions.createAction)('simpl/GET_RUNUSER_SCENARIOS', function (topic) {
  return _autobahn.default.call("".concat(topic, ".get_scenarios"));
});
/**
 * Populate simpl.current_runuser object with current runuser's info.
 *
 * @function
 * @memberof Simpl.actions.simpl
 * @param {Number} simpl_id - The user id on simpl-games-api.
 * @returns {NamedReduxAction}
 */

exports.getRunUserScenarios = getRunUserScenarios;
var getCurrentRunUserInfo = (0, _reduxActions.createAction)('simpl/GET_CURRENT_RUNUSER_INFO');
/**
 * Remove the most recent error from the store.
 *
 * @function
 * @memberof Simpl.actions.simpl
 * @returns {NamedReduxAction}
 */

exports.getCurrentRunUserInfo = getCurrentRunUserInfo;
var popError = (0, _reduxActions.createAction)('simpl/POP_ERROR');
/**
 * @namespace simpl
 * @memberof Simpl.actions
 */

exports.popError = popError;
var _default = {
  addChild: addChild,
  removeChild: removeChild,
  getDataTree: getDataTree,
  getRunUsers: getRunUsers,
  updateScope: updateScope,
  connectedScope: connectedScope,
  disconnectedScope: disconnectedScope,
  getCurrentRunPhase: getCurrentRunPhase,
  getCurrentRunUserInfo: getCurrentRunUserInfo,
  getPhases: getPhases,
  getRoles: getRoles,
  popError: popError
};
exports.default = _default;