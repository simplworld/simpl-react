import { createAction } from 'redux-actions';
import AutobahnReact from '../autobahn';

/*
 * action creators
 */

export const addChild = createAction('simpl/CHILD_ADD');
export const removeChild = createAction('simpl/CHILD_REMOVE');

/**
 * Given a scope's topic, returns a recursive representation of that scope and
 * its children.
 * @function
 * @memberof Simpl.actions.simpl
 * @param {string} scope - the scope's topic
 * @returns {NamedReduxAction}
 */
export const getDataTree = createAction('simpl/DATATREE_GET', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_scope_tree`, args)
));

/**
 * Given a scope's topic, returns a list of runusers that belong to the scope.
 * @function
 * @memberof Simpl.actions.simpl
 * @param {string} scope - the scope's topic
 * @returns {NamedReduxAction}
 */
export const getRunUsers = createAction('simpl/RUNUSERS_GET', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_active_runusers`, args)
));


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
export const updateScope = createAction('simpl/SCOPE_UPDATE');


/**
 * Dispatched when the client is ready to listen to a specific scope.
 *
 * Currently only used for debugging purposes.
 * @function
 * @memberof Simpl.actions.simpl
 * @param {string} scope - the scope's topic
 * @returns {NamedReduxAction}
 */
export const connectedScope = createAction('simpl/SCOPE_CONNECTED', (scope, ...args) => (
  AutobahnReact.publish(`${scope}.connected`, args)
));

/**
 * Dispatched when the client gets disconnected and can't listen to the scope.
 *
 * Currently only used for debugging purposes.
 * @function
 * @memberof Simpl.actions.simpl
 * @param {string} scope - the scope's topic
 * @returns {NamedReduxAction}
 */
export const disconnectedScope = createAction('simpl/SCOPE_DISCONNECTED', (scope, ...args) => (
  AutobahnReact.publish(`${scope}.disconnected`, args)
));

export const getCurrentRunPhase = createAction('simpl/CURRENT_RUN', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_current_run_and_phase`, args)
));

export const getPhases = createAction('simpl/GET_PHASES', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_phases`, args)
));

export const getRoles = createAction('simpl/GET_ROLES', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_roles`, args)
));

export const showGenericError = createAction('simpl/SHOW_GENERIC_ERROR');

// populate simpl.user space with current user's info
export const getUserInfo = createAction('simpl/GET_USER_INFO');

/**
 * Remove the most recent error from the store.
 *
 * @function
 * @memberof Simpl.actions.simpl
 * @returns {NamedReduxAction}
 */
export const popError = createAction('simpl/POP_ERROR');


/**
 * @namespace simpl
 * @memberof Simpl.actions
 */
export default {
  addChild,
  removeChild,

  getDataTree,
  getRunUsers,
  updateScope,
  connectedScope,
  disconnectedScope,
  getCurrentRunPhase,
  getUserInfo,
  getPhases,
  getRoles,
  popError,
};
