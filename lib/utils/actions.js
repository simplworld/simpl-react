/**
 * @namespace actions
 * @memberof Simpl.utils
 */

import { createAction } from 'redux-actions';


export function stringify(name, arg) {
  /* eslint no-param-reassign: "off" */
  arg.toString = () => name;
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
 * @param {function|undefined} [action] - Logic to perform before this action
 * will make it to the reducer.
 * @returns {NamedReduxAction}
 */
export function createNamedAction(type, ...args) {
  return stringify(type, createAction(type, ...args));
}

export default {
  stringify,
  createNamedAction,
};
