import { createReducer } from 'redux-create-reducer';
import recycleState from 'redux-recycle';

import _ from 'lodash';

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
  loaded_run: null,
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
  addTopics(state, newTopics) {
    const topics = [...state.topics, ...newTopics];
    return Object.assign({}, state, { topics });
  },
  removeTopic(state, payload) {
    const topic = `model:model.${payload.resource_name}.${payload.pk}`;
    // console.log('removeTopic: topic: ', topic, ', state.topics: ', state.topics);
    const index = state.topics.indexOf(topic);
    // console.log('removeTopic: index: ', index);
    if (index === -1) {
      return { ...state };
    }
    const updated = popAtIndex(state.topics, index);
    // console.log('removeTopic: updated: ', updated);
    return Object.assign({}, state, { ['topics']: updated });
  },
  removeChild(state, payload) {
    // Removes payload from its resource collection. Does not remove payload's topic.
    // console.log('removeChild: payload:', payload);
    const resourceName = payload.resource_name;
    const index = state[resourceName].findIndex((scope) => scope.pk === payload.pk);
    if (index === -1) {
      return { ...state };
    }
    const updated = popAtIndex(state[resourceName], index);
    return Object.assign({}, state, { [resourceName]: updated });
  },
  getDataTree(state, action) {
    let newState = this.addChild(state, action);
    const children = action.payload.children;
    if (action.payload.resource_name === 'run') { // children will be a runuser and worlds
      const runTopics = [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        runTopics.push(`model:model.${child.resource_name}.${child.pk}`);
      }
      newState = this.addTopics(newState, runTopics);
    }
    return children.reduce(
      (memo, child) => this.getDataTree(memo, { payload: child }), newState);
  },
  [SimplActions.addTopic](state, action) {
    // console.log('addTopic: action: ', action);
    return this.addTopics(state, [action.payload]);
  },
  [SimplActions.removeTopic](state, action) {
    // console.log('removeTopic: action: ', action);
    return this.removeTopic(state, action.payload);
  },
  [SimplActions.addChild](state, action) {
    // console.log('addChild: action: ', action);
    let newState = { ...state };
    if (action.payload.resource_name === 'world') {
      const topic = `model:model.world.${action.payload.pk}`;
      // console.log('adding topic for new world: topic:', topic);
      newState = this.addTopics(state, [topic]);
    }
    return this.addChild(newState, action);
  },
  [SimplActions.removeChild](state, action) {
    // console.log('removeChild: action: ', action);
    const resourceName = action.payload.resource_name;
    let newState = { ...state };
    if (resourceName === 'world') {
      // console.log('removing topic for world');
      newState = this.removeTopic(state, action.payload);
    }
    return this.removeChild(newState, action.payload);
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
    if (state.scenariosLoaded && state.rolesLoaded && state.phasesLoaded) {
      connectionStatus = CONNECTION_STATUS.LOADED;
    } else if (connectionStatus === CONNECTION_STATUS.CONNECTING) {
      connectionStatus = CONNECTION_STATUS.CONNECTED;
    }
    // console.log('SimplActions.getDataTree: connectionStatus=', connectionStatus,
    //    ', treeLoaded=', state.treeLoaded,
    //    ', scenariosLoaded=', state.scenariosLoaded,
    //    ', rolesLoaded', state.rolesLoaded,
    //    ', phasesLoaded', state.phasesLoaded);
    // console.log('SimplActions.getDataTree: action.payload:', action.payload);
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
    // This is useful for simpl user info -- not for current run identification
    if (state.runuser.length === 0) {
      throw "Runusers aren't loaded. Call `getRunUsers` before calling `getRunUserInfo`.";
    }
    const simplId = action.payload;
    let currentRunUser;
    state.runuser.forEach((runuser) => {
      if (runuser.user === simplId) {
        currentRunUser = runuser;
      }
    });
    return Object.assign({}, state, { current_runuser: currentRunUser });
  },
  [SimplActions.getRunUserScenarios](state, action) {
    if (action.payload.error) {
      return this.handleError(state, action);
    }
    let connectionStatus = state.connectionStatus;
    if (state.treeLoaded && state.rolesLoaded && state.phasesLoaded) {
      connectionStatus = CONNECTION_STATUS.LOADED;
    } else if (connectionStatus === CONNECTION_STATUS.CONNECTING) {
      connectionStatus = CONNECTION_STATUS.CONNECTED;
    }
    // console.log('SimplActions.getRunUserScenarios: connectionStatus=', connectionStatus,
    //    ', treeLoaded=', state.treeLoaded,
    //    ', scenariosLoaded=', state.scenariosLoaded,
    //    ', rolesLoaded', state.rolesLoaded,
    //    ', phasesLoaded', state.phasesLoaded);

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
    } else if (connectionStatus === CONNECTION_STATUS.CONNECTING) {
      connectionStatus = CONNECTION_STATUS.CONNECTED;
    }
    // console.log('SimplActions.getPhases: connectionStatus=', connectionStatus,
    //    ', treeLoaded=', state.treeLoaded,
    //    ', scenariosLoaded=', state.scenariosLoaded,
    //    ', rolesLoaded', state.rolesLoaded,
    //    ', phasesLoaded', state.phasesLoaded);

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
    } else if (connectionStatus === CONNECTION_STATUS.CONNECTING) {
      connectionStatus = CONNECTION_STATUS.CONNECTED;
    }
    // console.log('SimplActions.getRoles: connectionStatus=', connectionStatus,
    //    ', treeLoaded=', state.treeLoaded,
    //    ', scenariosLoaded=', state.scenariosLoaded,
    //    ', rolesLoaded', state.rolesLoaded,
    //    ', phasesLoaded', state.phasesLoaded);

    return Object.assign({}, state, {
      role: action.payload,
      rolesLoaded: true,
      connectionStatus,
    });
  },
  [SimplActions.setConnectionStatus](state, action) {
    // console.log('SimplActions.setConnectionStatus: connectionStatus=', connectionStatus,
    //    ', treeLoaded=', state.treeLoaded,
    //    ', scenariosLoaded=', state.scenariosLoaded,
    //    ', rolesLoaded', state.rolesLoaded,
    //    ', phasesLoaded', state.phasesLoaded);

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
  [SimplActions.loadRunData](state, action) {
    // console.log('SimplActions.loadRunData: run id:', action.payload.pk);
    // console.log('SimplActions.loadRunData: runusers:', action.payload.runusers);
    if (action.payload.error) {
      return this.handleError(state, action);
    }
    let connectionStatus = state.connectionStatus;
    if (state.scenariosLoaded && state.rolesLoaded && state.phasesLoaded) {
      connectionStatus = CONNECTION_STATUS.LOADED;
    } else if (connectionStatus === CONNECTION_STATUS.CONNECTING) {
      connectionStatus = CONNECTION_STATUS.CONNECTED;
    }
    // console.log('SimplActions.loadRunData: connectionStatus=', connectionStatus,
    //   ', treeLoaded=', state.treeLoaded,
    //   ', scenariosLoaded=', state.scenariosLoaded,
    //   ', rolesLoaded', state.rolesLoaded,
    //   ', phasesLoaded', state.phasesLoaded);
    let newState = { ...state };
    newState = this.getDataTree(Object.assign({}, state), action); // load run's worlds
    const runusers = action.payload.runusers;
    if (!_.isEmpty(runusers)) {
      // load run's players
      runusers.forEach(ru => {
        if (!ru.leader) {
          newState = this.addChild(newState, {payload: ru});
        }
      });
    }
    return Object.assign({}, newState, {
      treeLoaded: true,
      connectionStatus,
      loaded_run: action.payload.pk,
    });
  },
  [SimplActions.unloadRunData](state, action) {
    // console.log('SimplActions.unloadRunData: action:', action, ', loaded_run:', state.loaded_run);
    const loadedRun = state.loaded_run;
    if (_.isNil(loadedRun)) {
      return state;
    }
    let newState = { ...state };
    const worlds = newState.world;  // only one run is loaded at a time.
    if (!_.isEmpty(worlds)) {
      worlds.forEach((world) => {
        // console.log('remove topic for world:', world);
        newState = this.removeTopic(newState, world);
        // console.log('unload children of world');
        const scenarios = state.scenario.filter((s) => world.id === s.world);
        scenarios.forEach((scenario) => {
          const periods = state.period.filter((p) => scenario.id === p.scenario);
          periods.forEach((period) => {
            const decisions = state.decision.filter((d) => period.id === d.period);
            decisions.forEach((decision) => {
              newState = this.removeChild(newState, decision);
            });
            const results = state.result.filter((r) => period.id === r.period);
            results.forEach((result) => {
              newState = this.removeChild(newState, result);
            });
            newState = this.removeChild(newState, period);
          });
          newState = this.removeChild(newState, scenario);
        });
        newState = this.removeChild(newState, world);
      });
    }
    const runusers = newState.runuser;  // only one run is loaded at a time.
    // console.log('runusers:', runusers);
    if (!_.isEmpty(runusers)) {
      // unload run's players
      runusers.forEach((ru) => {
        if (!ru.leader) {
          // console.log('remove player:', ru);
          newState = this.removeChild(newState, ru);
        }
      });
    }
    return Object.assign({}, newState, { loaded_run: null });
  },
}), `${StateActions.recycleState}`);

export default simpl;
