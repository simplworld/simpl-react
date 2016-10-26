'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserInfo = exports.getRoles = exports.getPhases = exports.getCurrentRunPhase = exports.disconnectedScope = exports.connectedScope = exports.updateScope = exports.getRunUsers = exports.getDataTree = exports.removeChild = exports.addChild = undefined;

var _actions = require('../utils/actions');

var _autobahn = require('../autobahn');

var _autobahn2 = _interopRequireDefault(_autobahn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * action creators
 */

var addChild = exports.addChild = (0, _actions.createNamedAction)('CHILD_ADD');
var removeChild = exports.removeChild = (0, _actions.createNamedAction)('CHILD_REMOVE');

/**
 * Given a scope's topic return a recursive representation of that scope and its
 * children.
 * @function
 * @memberof Simpl.actions.simpl
 * @param {string} scope - the scope's topic
 * @returns {NamedReduxAction}
 */
var getDataTree = exports.getDataTree = (0, _actions.createNamedAction)('DATATREE_GET', function (scope) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _autobahn2.default.call(scope + '.get_scope_tree', args);
});
var getRunUsers = exports.getRunUsers = (0, _actions.createNamedAction)('RUNUSERS_GET', function (scope) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return _autobahn2.default.call(scope + '.get_active_runusers', args);
});
var updateScope = exports.updateScope = (0, _actions.createNamedAction)('SCOPE_UPDATE');
var connectedScope = exports.connectedScope = (0, _actions.createNamedAction)('SCOPE_CONNECTED', function (scope) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return _autobahn2.default.publish(scope + '.connected', args);
});
var disconnectedScope = exports.disconnectedScope = (0, _actions.createNamedAction)('SCOPE_DISCONNECTED', function (scope) {
  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  return _autobahn2.default.publish(scope + '.disconnected', args);
});

var getCurrentRunPhase = exports.getCurrentRunPhase = (0, _actions.createNamedAction)('CURRENT_RUN', function (scope) {
  for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  return _autobahn2.default.call(scope + '.get_current_run_and_phase', args);
});

var getPhases = exports.getPhases = (0, _actions.createNamedAction)('GET_PHASES', function (scope) {
  for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    args[_key6 - 1] = arguments[_key6];
  }

  return _autobahn2.default.call(scope + '.get_phases', args);
});

var getRoles = exports.getRoles = (0, _actions.createNamedAction)('GET_ROLES', function (scope) {
  for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    args[_key7 - 1] = arguments[_key7];
  }

  return _autobahn2.default.call(scope + '.get_roles', args);
});

// populate simpl.user space with current user's info
var getUserInfo = exports.getUserInfo = (0, _actions.createNamedAction)('GET_USER_INFO');

/**
 * @namespace simpl
 * @memberof Simpl.actions
 */
exports.default = {
  addChild: addChild,
  removeChild: removeChild,

  getDataTree: getDataTree,
  getRunUsers: getRunUsers,
  updateScope: updateScope,
  connectedScope: connectedScope,
  disconnectedScope: disconnectedScope,
  getCurrentRunPhase: getCurrentRunPhase,
  getUserInfo: getUserInfo,
  getPhases: getPhases,
  getRoles: getRoles
};