import { createReducer } from 'redux-create-reducer';
import recycleState from 'redux-recycle';

const SimplActions = require('../actions/simpl');
const StateActions = require('../actions/state');

import { popAtIndex, updateInCollection } from '../utils/collections';


const initial = {
  treeLoaded: false,
  phasesLoaded: false,
  rolesLoaded: false,
  loaded: false,
  user: {},
  current: {},
  run: [],
  runuser: [],
  world: [],
  round: [],
  scenario: [],
  period: [],
  decision: [],
  result: [],
  phase: [],
  role: [],
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

    const index = state[key].findIndex((scope) => scope.pk === action.payload.pk);
    let items;
    if (index > -1) {
      items = updateInCollection(state[key], index, kwargs);
    } else {
      items = [...state[key] || {}, kwargs];
    }
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
    let loaded = state.loaded;
    if (state.phasesLoaded) {
      loaded = true;
    }
    return Object.assign({}, this.getDataTree(Object.assign({}, state), action), {
      treeLoaded: true,
      loaded,
    });
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
  [SimplActions.getCurrentRunPhase](state, action) {
    const runState = this.addChild(state, { payload: action.payload.run });

    return Object.assign({}, runState, {
      current: {
        run: action.payload.run.pk,
        phase: action.payload.phase.pk,
      },
    });
  },
  [SimplActions.getUserInfo](state, action) {
    // Get the current user's info into the user namespace
    const username = action.payload;
    const roleTypes = new Set();
    let foundRunuser;

    state.runuser.forEach((runuser) => {
      if (runuser.role_name) {
        roleTypes.add(runuser.role_name);
      }

      if (runuser.username === username) {
        foundRunuser = runuser;
      }
    });

    // Remove this user's role and we're left with the "other" role names
    roleTypes.delete(foundRunuser.role_name);
    foundRunuser.other_roles = Array.from(roleTypes);
    return Object.assign({}, state, { user: foundRunuser });
  },
  [SimplActions.getPhases](state, action) {
    let loaded = state.loaded;
    if (state.treeLoaded && state.rolesLoaded) {
      loaded = true;
    }
    return Object.assign({}, state, {
      phase: action.payload,
      phasesLoaded: true,
      loaded,
    });
  },
  [SimplActions.getRoles](state, action) {
    let loaded = state.loaded;
    if (state.treeLoaded && state.phasesLoaded) {
      loaded = true;
    }
    return Object.assign({}, state, {
      role: action.payload,
      rolesLoaded: true,
      loaded,
    });
  },
}), `${StateActions.recycleState}`);

export default simpl;
