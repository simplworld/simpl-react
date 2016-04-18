import { createReducer } from 'redux-create-reducer'
import recycleState from 'redux-recycle'

import AutobahnReact from 'autobahn-react'

const StateActions = require('../actions/state')


const initial = {
  Autobahn: AutobahnReact
}

const wamp = recycleState(createReducer(initial, {
}), `${StateActions.recycleState}`);

export default wamp
