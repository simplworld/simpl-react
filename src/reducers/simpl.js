import { createReducer } from 'redux-create-reducer';
import recycleState from 'redux-recycle';
import { isNil } from 'lodash';

const SimplActions = require('../actions/simpl');
const StateActions = require('../actions/state');

import { CONNECTION_STATUS } from '../constants';
import { popAtIndex, updateInCollection } from '../utils/collections';


const initial = {
  treeLoaded: false,
  phasesLoaded: false,
  rolesLoaded: false,
  scenariosLoaded: false,
  connectionStatus: CONNECTION_STATUS.CONNECTING,
  current_runuser: {},
  current: {},
  run: [],
  runuser: [],
  world: [],
  scenario: [],
  period: [],
  decision: [],
  result: [],
  phase: [],
  role: [],
  errors: [],
  topics: [],
};

const simpl = recycleState(createReducer(initial, {
  handleError(state, action) {
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
  addTopic(state, topic) {
    console.log(`addTopic: ${topic}`);
    const topics = [...state.topics, topic];
    return Object.assign({}, state, { topics });
  },
  getDataTree(state, action) {
    let newState = this.addChild(state, action);
    const children = action.payload.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.resource_name === 'world' || child.resource_name === 'runuser') {
        newState = this.addTopic(newState, `model:model.${child.resource_name}.${child.pk}`);
      }
    }
    return children.reduce(
      (memo, child) => this.getDataTree(memo, { payload: child }), newState);
  },
  [SimplActions.addChild](state, action) {
    return this.addChild(state, action);
  },
  [SimplActions.removeChild](state, action) {
    const key = action.payload.resource_name;
    const index = state[key].findIndex((scope) => scope.pk === action.payload.pk);
    if (index === -1) {
      return { ...state };
    }
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
    let connectionStatus = state.connectionStatus;
    if (state.phasesLoaded) {
      connectionStatus = CONNECTION_STATUS.CONNECTED; // TODO why CONNECTION_STATUS.CONNECTED?
    }
    return Object.assign({}, this.getDataTree(Object.assign({}, state), action), {
      treeLoaded: true,
      connectionStatus,
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
  [SimplActions.getCurrentRunUserInfo](state, action) {
    // Get the current user's info into the current_runuser namespace
    if (state.runuser.length == 0) {
      throw "Runusers aren't loaded yet. You need to call `getRunUsers` before calling `getRunUserInfo`.";
    }
    const simpl_id = action.payload;
    const roleTypes = new Set();
    let currentRunUser;
    state.runuser.forEach((runuser) => {
      if (runuser.user === simpl_id) {
        currentRunUser = runuser;   // fairly useless unless runuser is a player
      }
      if (!isNil(runuser.role_name)) { // runuser is a player
        roleTypes.add(runuser.role_name);
      }
    });
    if (!isNil(currentRunUser) && !isNil(currentRunUser.role_name)) {
      // Remove current runuser's role and we're left with the "other" role names
      roleTypes.delete(currentRunUser.role_name);
      currentRunUser.other_roles = Array.from(roleTypes);
    }
    return Object.assign({}, state, { current_runuser: currentRunUser });
  },
  [SimplActions.getRunUserScenarios](state, action) {
    if (action.payload.error) {
      return this.handleError(state, action);
    }
    let connectionStatus = state.connectionStatus;
    if (state.treeLoaded && state.rolesLoaded && state.phasesLoaded) {
      connectionStatus = CONNECTION_STATUS.LOADED;
    }
    const scenarios = action.payload;
    let newState = { ...state };
    scenarios.forEach((scenario) => {
      newState = this.getDataTree(newState, { payload: scenario });
    });
    // return newState;
    return Object.assign({}, newState, {
      scenariosLoaded: true,
      connectionStatus,
    });
  },
  [SimplActions.getPhases](state, action) {
    let connectionStatus = state.connectionStatus;
    if (state.treeLoaded && state.rolesLoaded && state.scenariosLoaded) {
      connectionStatus = CONNECTION_STATUS.LOADED;
    }
    return Object.assign({}, state, {
      phase: action.payload,
      phasesLoaded: true,
      connectionStatus,
    });
  },
  [SimplActions.getRoles](state, action) {
    let connectionStatus = state.connectionStatus;
    if (state.treeLoaded && state.phasesLoaded && state.scenariosLoaded) {
      connectionStatus = CONNECTION_STATUS.LOADED;
    }
    return Object.assign({}, state, {
      role: action.payload,
      rolesLoaded: true,
      connectionStatus,
    });
  },
  [SimplActions.setConnectionStatus](state, action) {
    return Object.assign({}, state, { connectionStatus: action.payload });
  },
  [SimplActions.showGenericError](state, action) {
    const error = { msg: action.payload[0] };
    const errors = [...state.errors, error];
    return Object.assign({}, state, { errors });
  },
  [SimplActions.popError](state) {
    const errors = [...state.errors];
    errors.pop();
    return Object.assign({}, state, { errors });
  },
}), `${StateActions.recycleState}`);

export default simpl;
