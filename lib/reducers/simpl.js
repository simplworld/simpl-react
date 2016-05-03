import { createReducer } from 'redux-create-reducer'
import recycleState from 'redux-recycle'

const SimplActions = require('../actions/simpl')
const StateActions = require('../actions/state')

import { popAtIndex, updateInCollection } from '../utils/collections'


const initial = {
  loaded: false
}

const simpl = recycleState(createReducer(initial, {
  _pushKey(key, state, action) {
    const items = [...state[key] || {}, action.payload]
    return Object.assign({}, state, {[key]: items})
  },
  _addChild(state, action) {
    const key = action.payload.resource_name
    const kwargs = Object.assign({}, action.payload.data, {pk: action.payload.pk, resource_name: action.payload.resource_name})
    return this._pushKey(key, state, {payload: kwargs})
  },    
  _getDataTree(state, action) {
    const newState = this._addChild(state, action)
    return action.payload.children.reduce((memo, child) => {
      return this._getDataTree(memo, {payload: child})
    }, newState)
  },
  [SimplActions.addChild](state, action) {
    return this._addChild(state, action)
  },
  [SimplActions.removeChild](state, action) {
    const key = action.payload.resource_name
    const index = state[key].findIndex((scope) => scope.pk == action.payload.pk)
    return popAtIndex(state[key], index)
  },
  [SimplActions.getDataTree](state, action) {
    return Object.assign({}, this._getDataTree(state, action), {loaded: true})
  },
  [SimplActions.updateScope](state, action) {
    const key = action.payload.resource_name
    const data = Object.assign({}, action.payload.data, {pk: action.payload.pk})
    const index = state[key].findIndex((scope) => scope.pk == action.payload.pk)
    const newCollection = updateInCollection(state[key], index, data)

    return Object.assign({}, state, {[key]: newCollection})
  }

}), `${StateActions.recycleState}`);

export default simpl
