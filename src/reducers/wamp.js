import { createReducer } from 'redux-create-reducer';
import recycleState from 'redux-recycle';

import Autobahn from 'autobahn-react';

const StateActions = require('../actions/state');


const initial = {
  Autobahn,
};

const wamp = recycleState(createReducer(initial, {
}), `${StateActions.recycleState}`);

export default wamp;
