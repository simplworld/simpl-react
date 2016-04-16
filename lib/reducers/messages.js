import { createReducer } from 'redux-create-reducer'
import recycleState from 'redux-recycle'

const MessageActions = require('../actions/messages')
const StateActions = require('../actions/state')


const initial = {
}

const Message = function(payload) {
    return {args: payload[0], kwargs: payload[1], details: payload[2]}
}

const messages = recycleState(createReducer(initial, {
  [MessageActions.appendMessage](state, action) {
    const payload = action.payload
    const variable = payload.variable
    const message = Message(payload)

    const newVar = [...state[variable] || [], message]

    return Object.assign({}, state, {[variable]: newVar})
  },
  [MessageActions.updateMessage](state, action) {
    const payload = action.payload
    const variable = payload.variable
    const message = Message(payload)

    return Object.assign({}, state, {[variable]: message})
  }
}), `${StateActions.recycleState}`);

export default messages
