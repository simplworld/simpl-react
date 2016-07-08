import { createReducer } from 'redux-create-reducer';
import recycleState from 'redux-recycle';

const SimplActions = require('../actions/simpl');
const StateActions = require('../actions/state');

import { popAtIndex, updateInCollection } from '../utils/collections';


const initial = {
  loaded: false,
  game: [],
  run: [],
  runuser: [],
  world: [],
  round: [],
  scenario: [],
  period: [],
  decision: [],
  result: [],
};

const simpl = recycleState(createReducer(initial, {
  handleError(state, action) {
    console.error(action.payload.error, action.payload.args, action.payload.kwargs);
    return state;
  },
  addChild(state, action) {
    const key = action.payload.resource_name;
    const kwargs = Object.assign({}, action.payload.data, {
      pk: action.payload.pk,
      resource_name: action.payload.resource_name,
    });

    const items = [...state[key] || {}, kwargs];
    return Object.assign({}, state, { [key]: items });
  },
  getDataTree(state, action) {
    const newState = this.addChild(state, action);
    return action.payload.children.reduce(
      (memo, child) => this.getDataTree(memo, { payload: child })
    , newState);
  },
  [SimplActions.addChild](state, action) {
    return this.addChild(state, action);
  },
  [SimplActions.removeChild](state, action) {
    const key = action.payload.resource_name;
    const index = state[key].findIndex((scope) => scope.pk === action.payload.pk);
    const updated = popAtIndex(state[key], index);
    return Object.assign({}, state, { [key]: updated });
  },
  [SimplActions.getRunUsers](state, action) {
    if (action.payload.error) {
      return this.handleError(state, action);
    }
    return action.payload.reduce((memo, child) => (
      this.addChild(memo, { payload: child })
    ), Object.assign({}, state));
  },
  [SimplActions.getDataTree](state, action) {
    if (action.payload.error) {
      return this.handleError(state, action);
    }
    return Object.assign({}, this.getDataTree(Object.assign({}, state), action), { loaded: true });
  },
  [SimplActions.updateScope](state, action) {
    const key = action.payload.resource_name;
    const data = Object.assign({}, action.payload.data, { pk: action.payload.pk });
    const index = state[key].findIndex((scope) => scope.pk === action.payload.pk);
    if (index === -1) {
      return state;
    }
    const newCollection = updateInCollection(state[key], index, data);

    return Object.assign({}, state, { [key]: newCollection });
  },

}), `${StateActions.recycleState}`);

export default simpl;
