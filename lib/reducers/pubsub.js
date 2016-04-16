import { createReducer } from 'redux-create-reducer'
import recycleState from 'redux-recycle'

import AutobahnReact from 'autobahn-react'

const StateActions = require('../actions/state')


const initial = {
  Autobahn: AutobahnReact
}

const pubsub = recycleState(createReducer(initial, {
}), `${StateActions.recycleState}`);

export default pubsub
