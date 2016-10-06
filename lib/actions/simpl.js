import { createNamedAction } from '../utils/actions';
import AutobahnReact from '../vendor/autobahn-react';

/*
 * action creators
 */

export const addChild = createNamedAction('CHILD_ADD');
export const removeChild = createNamedAction('CHILD_REMOVE');

export const getDataTree = createNamedAction('DATATREE_GET', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_scope_tree`, args)
));
export const getRunUsers = createNamedAction('RUNUSERS_GET', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_active_runusers`, args)
));
export const updateScope = createNamedAction('SCOPE_UPDATE');
export const connectedScope = createNamedAction('SCOPE_CONNECTED', (scope, ...args) => (
  AutobahnReact.publish(`${scope}.connected`, args)
));
export const disconnectedScope = createNamedAction('SCOPE_DISCONNECTED', (scope, ...args) => (
  AutobahnReact.publish(`${scope}.disconnected`, args)
));

export const getCurrentRunPhase = createNamedAction('CURRENT_RUN', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_current_run_and_phase`, args)
));

export const getPhases = createNamedAction('GET_PHASES', (scope, ...args) => (
  AutobahnReact.call(`${scope}.get_phases`, args)
));

// populate simpl.user space with current user's info
export const getUserInfo = createNamedAction('GET_USER_INFO');

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
};
