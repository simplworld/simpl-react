import { createReducer } from 'redux-create-reducer'
import recycleState from 'redux-recycle'

const SimplActions = require('../actions/simpl')
const StateActions = require('../actions/state')


const initial = {
    run: [],
    world: [],
    round: [],
    scenario: [],
    period: [],
    decision: [],
    result: []

}

const simpl = recycleState(createReducer(initial, {
    _pushKey(key, state, action) {
        const items = [...state[key], action.payload]
        return Object.assign({}, state, {[key]: items})
    },
    [SimplActions.addChild](state, action) {
        const key = action.payload.klass
        const kwargs = Object.assign({}, action.payload.kwargs, {pk: action.payload.pk})
        return this._pushKey(key, state, {payload: kwargs})
    },
    [SimplActions.addResult](state, action) {
        return this._pushKey('result', state, action)
    },
    [SimplActions.addDecision](state, action) {
        return this._pushKey('decision', state, action)
    },
    [SimplActions.addPeriod](state, action) {
        return this._pushKey('period', state, action)
    },
    [SimplActions.addScenario](state, action) {
        return this._pushKey('scenario', state, action)
    },
    [SimplActions.addRound](state, action) {
        return this._pushKey('round', state, action)
    },
    [SimplActions.addWorld](state, action) {
        return this._pushKey('world', state, action)
    },
    [SimplActions.addRun](state, action) {
        return this._pushKey('run', state, action)
    },
}), `${StateActions.recycleState}`);

export default simpl
