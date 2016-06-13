import { createNamedAction } from '../utils/actions'
import AutobahnReact from '../vendor/autobahn-react'

/*
 * action creators
 */

export const addChild = createNamedAction('CHILD_ADD')
export const removeChild = createNamedAction('CHILD_REMOVE')

export const getDataTree = createNamedAction('DATATREE_GET', (scope, ...args ) => AutobahnReact.call(`${scope}.get_scope_tree`, args))
export const updateScope = createNamedAction('SCOPE_UPDATE')
export const connectedScope = createNamedAction('SCOPE_CONNECTED', (scope, ...args ) => AutobahnReact.publish(`${scope}.connected`, args))
export const disconnectedScope = createNamedAction('SCOPE_DISCONNECTED', (scope, ...args ) => AutobahnReact.publish(`${scope}.disconnected`, args))

export default {
  addChild,
  removeChild,

  getDataTree,
  updateScope,
  connectedScope,
  disconnectedScope
}
