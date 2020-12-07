"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reduxCreateReducer = require("redux-create-reducer");

var _reduxRecycle = _interopRequireDefault(require("redux-recycle"));

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");

var _collections = require("../utils/collections");

var _createReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SimplActions = require('../actions/simpl');

var StateActions = require('../actions/state');

var initial = {
  treeLoaded: false,
  phasesLoaded: false,
  rolesLoaded: false,
  scenariosLoaded: false,
  connectionStatus: _constants.CONNECTION_STATUS.CONNECTING,
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
  topics: []
};
var simpl = (0, _reduxRecycle.default)((0, _reduxCreateReducer.createReducer)(initial, (_createReducer = {
  handleError: function handleError(state, action) {
    return state;
  },
  addChild: function addChild(state, action) {
    var key = action.payload.resource_name;

    var kwargs = _extends({}, action.payload.data, {
      pk: action.payload.pk,
      resource_name: action.payload.resource_name
    });

    var index = state[key].findIndex(function (scope) {
      return scope.pk === action.payload.pk;
    });
    var items;

    if (index > -1) {
      items = (0, _collections.updateInCollection)(state[key], index, kwargs);
    } else {
      items = _toConsumableArray(state[key] || {}).concat([kwargs]);
    }

    return _extends({}, state, _defineProperty({}, key, items));
  },
  addTopics: function addTopics(state, newTopics) {
    var topics = _toConsumableArray(state.topics).concat(_toConsumableArray(newTopics));

    return _extends({}, state, {
      topics: topics
    });
  },
  removeTopic: function removeTopic(state, payload) {
    var topic = "model:model.".concat(payload.resource_name, ".").concat(payload.pk); // console.log('removeTopic: topic: ', topic, ', state.topics: ', state.topics);

    var index = state.topics.indexOf(topic); // console.log('removeTopic: index: ', index);

    if (index === -1) {
      return _objectSpread({}, state);
    }

    var updated = (0, _collections.popAtIndex)(state.topics, index); // console.log('removeTopic: updated: ', updated);

    return _extends({}, state, _defineProperty({}, 'topics', updated));
  },
  removeChild: function removeChild(state, payload) {
    // Removes payload from its resource collection. Does not remove payload's topic.
    // console.log('removeChild: payload:', payload);
    var resourceName = payload.resource_name;
    var index = state[resourceName].findIndex(function (scope) {
      return scope.pk === payload.pk;
    });

    if (index === -1) {
      return _objectSpread({}, state);
    }

    var updated = (0, _collections.popAtIndex)(state[resourceName], index);
    return _extends({}, state, _defineProperty({}, resourceName, updated));
  },
  getDataTree: function getDataTree(state, action) {
    var _this = this;

    var newState = this.addChild(state, action);
    var children = action.payload.children;

    if (action.payload.resource_name === 'run') {
      // children will be a runuser and worlds
      var runTopics = [];

      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        runTopics.push("model:model.".concat(child.resource_name, ".").concat(child.pk));
      }

      newState = this.addTopics(newState, runTopics);
    }

    return children.reduce(function (memo, child) {
      return _this.getDataTree(memo, {
        payload: child
      });
    }, newState);
  }
}, _defineProperty(_createReducer, SimplActions.addTopic, function (state, action) {
  // console.log('addTopic: action: ', action);
  return this.addTopics(state, [action.payload]);
}), _defineProperty(_createReducer, SimplActions.removeTopic, function (state, action) {
  // console.log('removeTopic: action: ', action);
  return this.removeTopic(state, action.payload);
}), _defineProperty(_createReducer, SimplActions.addChild, function (state, action) {
  // console.log('addChild: action: ', action);
  var newState = _objectSpread({}, state);

  if (action.payload.resource_name === 'world') {
    var topic = "model:model.world.".concat(action.payload.pk); // console.log('adding topic for new world: topic:', topic);

    newState = this.addTopics(state, [topic]);
  }

  return this.addChild(newState, action);
}), _defineProperty(_createReducer, SimplActions.removeChild, function (state, action) {
  // console.log('removeChild: action: ', action);
  var resourceName = action.payload.resource_name;

  var newState = _objectSpread({}, state);

  if (resourceName === 'world') {
    // console.log('removing topic for world');
    newState = this.removeTopic(state, action.payload);
  }

  return this.removeChild(newState, action.payload);
}), _defineProperty(_createReducer, SimplActions.getRunUsers, function (state, action) {
  var _this2 = this;

  if (action.payload.error) {
    return this.handleError(state, action);
  }

  return action.payload.reduce(function (memo, child) {
    return _this2.addChild(memo, {
      payload: child
    });
  }, _extends({}, state));
}), _defineProperty(_createReducer, SimplActions.getDataTree, function (state, action) {
  if (action.payload.error) {
    return this.handleError(state, action);
  }

  var connectionStatus = state.connectionStatus;

  if (state.scenariosLoaded && state.rolesLoaded && state.phasesLoaded) {
    connectionStatus = _constants.CONNECTION_STATUS.LOADED;
  } else if (connectionStatus === _constants.CONNECTION_STATUS.CONNECTING) {
    connectionStatus = _constants.CONNECTION_STATUS.CONNECTED;
  } // console.log('SimplActions.getDataTree: connectionStatus=', connectionStatus,
  //    ', treeLoaded=', state.treeLoaded,
  //    ', scenariosLoaded=', state.scenariosLoaded,
  //    ', rolesLoaded', state.rolesLoaded,
  //    ', phasesLoaded', state.phasesLoaded);
  // console.log('SimplActions.getDataTree: action.payload:', action.payload);


  return _extends({}, this.getDataTree(_extends({}, state), action), {
    treeLoaded: true,
    connectionStatus: connectionStatus
  });
}), _defineProperty(_createReducer, SimplActions.updateScope, function (state, action) {
  var key = action.payload.resource_name;

  var data = _extends({}, action.payload.data, {
    pk: action.payload.pk
  });

  var index = state[key].findIndex(function (scope) {
    return scope.pk === action.payload.pk;
  });

  if (index === -1) {
    return state;
  }

  var newCollection = (0, _collections.updateInCollection)(state[key], index, data);
  return _extends({}, state, _defineProperty({}, key, newCollection));
}), _defineProperty(_createReducer, SimplActions.getCurrentRunPhase, function (state, action) {
  var runState = this.addChild(state, {
    payload: action.payload.run
  });
  return _extends({}, runState, {
    current: {
      run: action.payload.run.pk,
      phase: action.payload.phase.pk
    }
  });
}), _defineProperty(_createReducer, SimplActions.getCurrentRunUserInfo, function (state, action) {
  // Get the current user's info into the current_runuser namespace
  // This is useful for simpl user info -- not for current run identification
  if (state.runuser.length === 0) {
    throw "Runusers aren't loaded. Call `getRunUsers` before calling `getRunUserInfo`.";
  }

  var simplId = action.payload;
  var currentRunUser;
  state.runuser.forEach(function (runuser) {
    if (runuser.user === simplId) {
      currentRunUser = runuser;
    }
  });
  return _extends({}, state, {
    current_runuser: currentRunUser
  });
}), _defineProperty(_createReducer, SimplActions.getRunUserScenarios, function (state, action) {
  var _this3 = this;

  if (action.payload.error) {
    return this.handleError(state, action);
  }

  var connectionStatus = state.connectionStatus;

  if (state.treeLoaded && state.rolesLoaded && state.phasesLoaded) {
    connectionStatus = _constants.CONNECTION_STATUS.LOADED;
  } else if (connectionStatus === _constants.CONNECTION_STATUS.CONNECTING) {
    connectionStatus = _constants.CONNECTION_STATUS.CONNECTED;
  } // console.log('SimplActions.getRunUserScenarios: connectionStatus=', connectionStatus,
  //    ', treeLoaded=', state.treeLoaded,
  //    ', scenariosLoaded=', state.scenariosLoaded,
  //    ', rolesLoaded', state.rolesLoaded,
  //    ', phasesLoaded', state.phasesLoaded);


  var scenarios = action.payload;

  var newState = _objectSpread({}, state);

  scenarios.forEach(function (scenario) {
    newState = _this3.getDataTree(newState, {
      payload: scenario
    });
  }); // return newState;

  return _extends({}, newState, {
    scenariosLoaded: true,
    connectionStatus: connectionStatus
  });
}), _defineProperty(_createReducer, SimplActions.getPhases, function (state, action) {
  var connectionStatus = state.connectionStatus;

  if (state.treeLoaded && state.rolesLoaded && state.scenariosLoaded) {
    connectionStatus = _constants.CONNECTION_STATUS.LOADED;
  } else if (connectionStatus === _constants.CONNECTION_STATUS.CONNECTING) {
    connectionStatus = _constants.CONNECTION_STATUS.CONNECTED;
  } // console.log('SimplActions.getPhases: connectionStatus=', connectionStatus,
  //    ', treeLoaded=', state.treeLoaded,
  //    ', scenariosLoaded=', state.scenariosLoaded,
  //    ', rolesLoaded', state.rolesLoaded,
  //    ', phasesLoaded', state.phasesLoaded);


  return _extends({}, state, {
    phase: action.payload,
    phasesLoaded: true,
    connectionStatus: connectionStatus
  });
}), _defineProperty(_createReducer, SimplActions.getRoles, function (state, action) {
  var connectionStatus = state.connectionStatus;

  if (state.treeLoaded && state.phasesLoaded && state.scenariosLoaded) {
    connectionStatus = _constants.CONNECTION_STATUS.LOADED;
  } else if (connectionStatus === _constants.CONNECTION_STATUS.CONNECTING) {
    connectionStatus = _constants.CONNECTION_STATUS.CONNECTED;
  } // console.log('SimplActions.getRoles: connectionStatus=', connectionStatus,
  //    ', treeLoaded=', state.treeLoaded,
  //    ', scenariosLoaded=', state.scenariosLoaded,
  //    ', rolesLoaded', state.rolesLoaded,
  //    ', phasesLoaded', state.phasesLoaded);


  return _extends({}, state, {
    role: action.payload,
    rolesLoaded: true,
    connectionStatus: connectionStatus
  });
}), _defineProperty(_createReducer, SimplActions.setConnectionStatus, function (state, action) {
  // console.log('SimplActions.setConnectionStatus: connectionStatus=', connectionStatus,
  //    ', treeLoaded=', state.treeLoaded,
  //    ', scenariosLoaded=', state.scenariosLoaded,
  //    ', rolesLoaded', state.rolesLoaded,
  //    ', phasesLoaded', state.phasesLoaded);
  return _extends({}, state, {
    connectionStatus: action.payload
  });
}), _defineProperty(_createReducer, SimplActions.showGenericError, function (state, action) {
  var error = {
    msg: action.payload[0]
  };

  var errors = _toConsumableArray(state.errors).concat([error]);

  return _extends({}, state, {
    errors: errors
  });
}), _defineProperty(_createReducer, SimplActions.popError, function (state) {
  var errors = _toConsumableArray(state.errors);

  errors.pop();
  return _extends({}, state, {
    errors: errors
  });
}), _defineProperty(_createReducer, SimplActions.loadRunData, function (state, action) {
  var _this4 = this;

  // console.log('SimplActions.loadRunData: run id:', action.payload.pk);
  // console.log('SimplActions.loadRunData: runusers:', action.payload.runusers);
  console.log('SimplActions.loadRunData: player_scenarios:', action.payload.player_scenarios);

  if (action.payload.error) {
    return this.handleError(state, action);
  }

  var connectionStatus = state.connectionStatus;

  if (state.scenariosLoaded && state.rolesLoaded && state.phasesLoaded) {
    connectionStatus = _constants.CONNECTION_STATUS.LOADED;
  } else if (connectionStatus === _constants.CONNECTION_STATUS.CONNECTING) {
    connectionStatus = _constants.CONNECTION_STATUS.CONNECTED;
  } // console.log('SimplActions.loadRunData: connectionStatus=', connectionStatus,
  //   ', treeLoaded=', state.treeLoaded,
  //   ', scenariosLoaded=', state.scenariosLoaded,
  //   ', rolesLoaded', state.rolesLoaded,
  //   ', phasesLoaded', state.phasesLoaded);


  var newState = _objectSpread({}, state);

  newState = this.getDataTree(_extends({}, state), action); // load run's worlds

  var runusers = action.payload.runusers;

  if (!_lodash.default.isEmpty(runusers)) {
    // load run's players
    runusers.forEach(function (ru) {
      if (!ru.leader) {
        newState = _this4.addChild(newState, {
          payload: ru
        });
      }
    });
  }

  var playerScenarios = action.payload.player_scenarios;

  if (!_lodash.default.isEmpty(playerScenarios)) {
    // load run's player scenarios
    playerScenarios.forEach(function (scenario) {
      newState = _this4.getDataTree(newState, {
        payload: scenario
      });
    });
  }

  return _extends({}, newState, {
    treeLoaded: true,
    connectionStatus: connectionStatus,
    loaded_run: action.payload.pk
  });
}), _defineProperty(_createReducer, SimplActions.unloadRunData, function (state, action) {
  var _this5 = this;

  console.log('SimplActions.unloadRunData: action:', action, ', loaded_run:', state.loaded_run);
  var loadedRun = state.loaded_run;

  if (_lodash.default.isNil(loadedRun)) {
    return state;
  }

  var newState = _objectSpread({}, state);

  var worlds = newState.world; // only one run is loaded at a time.

  if (!_lodash.default.isEmpty(worlds)) {
    worlds.forEach(function (world) {
      // console.log('remove topic for world:', world);
      newState = _this5.removeTopic(newState, world); // console.log('unload children of world');

      var scenarios = state.scenario.filter(function (s) {
        return world.id === s.world;
      });
      scenarios.forEach(function (scenario) {
        var periods = state.period.filter(function (p) {
          return scenario.id === p.scenario;
        });
        periods.forEach(function (period) {
          var decisions = state.decision.filter(function (d) {
            return period.id === d.period;
          });
          decisions.forEach(function (decision) {
            newState = _this5.removeChild(newState, decision);
          });
          var results = state.result.filter(function (r) {
            return period.id === r.period;
          });
          results.forEach(function (result) {
            newState = _this5.removeChild(newState, result);
          });
          newState = _this5.removeChild(newState, period);
        });
        newState = _this5.removeChild(newState, scenario);
      });
      newState = _this5.removeChild(newState, world);
    });
  }

  var runusers = newState.runuser; // only one run is loaded at a time.
  // console.log('runusers:', runusers);

  if (!_lodash.default.isEmpty(runusers)) {
    // unload run's players
    runusers.forEach(function (ru) {
      if (!ru.leader) {
        // console.log('remove player:', ru);
        // unload player scenarios
        var scenarios = state.scenario.filter(function (s) {
          return ru.id === s.runuser;
        });
        scenarios.forEach(function (scenario) {
          var periods = state.period.filter(function (p) {
            return scenario.id === p.scenario;
          });
          periods.forEach(function (period) {
            var decisions = state.decision.filter(function (d) {
              return period.id === d.period;
            });
            decisions.forEach(function (decision) {
              newState = _this5.removeChild(newState, decision);
            });
            var results = state.result.filter(function (r) {
              return period.id === r.period;
            });
            results.forEach(function (result) {
              newState = _this5.removeChild(newState, result);
            });
            newState = _this5.removeChild(newState, period);
          });
          newState = _this5.removeChild(newState, scenario);
        });
        newState = _this5.removeChild(newState, ru);
      }
    });
  }

  return _extends({}, newState, {
    loaded_run: null
  });
}), _createReducer)), "".concat(StateActions.recycleState));
var _default = simpl;
exports.default = _default;