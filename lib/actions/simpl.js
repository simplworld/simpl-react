import { createNamedAction } from '../utils/actions'
import AutobahnReact from '../vendor/autobahn-react'

/*
 * action creators
 */

export const addChild = createNamedAction('CHILD_ADD')
export const addResult = createNamedAction('RESULT_ADD')
export const addDecision = createNamedAction('DECISION_ADD')
export const addPeriod = createNamedAction('PERIOD_ADD')
export const addScenario = createNamedAction('SCENARIO_ADD')
export const addRound = createNamedAction('ROUND_ADD')
export const addWorld = createNamedAction('WORLD_ADD')
export const addRun = createNamedAction('RUN_ADD')

export const getDataTree = createNamedAction('DATATREE_GET', (scope, ...args ) => AutobahnReact.call(`${scope}.get_data_tree`, args))

export default {
    addChild,
    addResult,
    addDecision,
    addPeriod,
    addScenario,
    addRound,
    addWorld,
    addRun,

    getDataTree
}
