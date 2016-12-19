'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringify = stringify;
exports.createNamedAction = createNamedAction;

var _reduxActions = require('redux-actions');

function stringify(name, arg) {
  /* eslint no-param-reassign: "off" */
  arg.toString = function () {
    return name;
  };
  return arg;
}

/**
 *  An action that's serializable to the provided action name.
 * @typedef {function} NamedReduxAction
 * @param {string} type - A unique name for the action
 * @param {function|undefined} [action] - Logic to perform before this action
 * will make it to the reducer.
 * @property {function} toString() - return the action's name.
*/

/**
 * Shortcut function to create an action that's serializable to a string and usable
 * as an object property.
 * Use this to create an option that's usable from within a reducer.
 * @function
 * @memberof Simpl.utils.actions
 * @param {string} type - A unique name for the action
 * @param {spread} args - Additional arguments to pass to redux-actions.createAction.
 * @returns {NamedReduxAction}
 */
/**
 * @namespace actions
 * @memberof Simpl.utils
 */
function createNamedAction(type) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return stringify(type, _reduxActions.createAction.apply(undefined, [type].concat(args)));
}

exports.default = {
  stringify: stringify,
  createNamedAction: createNamedAction
};