import { createReducer } from 'redux-create-reducer'
import recycleState from 'redux-recycle'

const PubSubActions = require('../actions/PubSubActions')
const StateActions = require('../actions/StateActions')


const initial = {}

const Message = function(payload) {
    return {args: payload[0], kwargs: payload[1], details: payload[2]}
}

const messages = recycleState(createReducer(initial, {
  [PubSubActions.appendMessage](state, action) {
    const payload = action.payload
    const variable = payload.variable
    const message = Message(payload)

    const newVar = [...state[variable] || [], message]

    return Object.assign({}, state, {[variable]: newVar})
  },
  [PubSubActions.updateMessage](state, action) {
    const payload = action.payload
    const variable = payload.variable
    const message = Message(payload)

    return Object.assign({}, state, {[variable]: message})
  }
}), `${StateActions.recycleState}`);

export default messages
