'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createReducer;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reduxCreateReducer = require('redux-create-reducer');

var _reduxRecycle = require('redux-recycle');

var _reduxRecycle2 = _interopRequireDefault(_reduxRecycle);

var _lodash = require('lodash');

var _constants = require('../constants');

var _collections = require('../utils/collections');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
  run: [],
  runuser: [],
  world: [],
  scenario: [],
  period: [],
  decision: [],
  result: [],
  phase: [],
  role: [],
  errors: []
};

var simpl = (0, _reduxRecycle2.default)((0, _reduxCreateReducer.createReducer)(initial, (_createReducer = {
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
    var items = void 0;
    if (index > -1) {
      items = (0, _collections.updateInCollection)(state[key], index, kwargs);
    } else {
      items = [].concat(_toConsumableArray(state[key] || {}), [kwargs]);
    }
    return _extends({}, state, _defineProperty({}, key, items));
  },
  getDataTree: function getDataTree(state, action) {
    var _this = this;

    var newState = this.addChild(state, action);
    // console.log('getDataTree: action.payload.children: ', action.payload.children);
    return action.payload.children.reduce(function (memo, child) {
      return _this.getDataTree(memo, { payload: child });
    }, newState);
  }
}, _defineProperty(_createReducer, SimplActions.addChild, function (state, action) {
  return this.addChild(state, action);
}), _defineProperty(_createReducer, SimplActions.removeChild, function (state, action) {
  var key = action.payload.resource_name;
  var index = state[key].findIndex(function (scope) {
    return scope.pk === action.payload.pk;
  });
  if (index === -1) {
    return _extends({}, state);
  }
  var updated = (0, _collections.popAtIndex)(state[key], index);
  return _extends({}, state, _defineProperty({}, key, updated));
}), _defineProperty(_createReducer, SimplActions.getRunUsers, function (state, action) {
  var _this2 = this;

  if (action.payload.error) {
    return this.handleError(state, action);
  }
  console.log('reduce SimplActions.getRunUsers: action.payload: ', action.payload);
  return action.payload.reduce(function (memo, child) {
    return _this2.addChild(memo, { payload: child });
  }, _extends({}, state));
}), _defineProperty(_createReducer, SimplActions.getDataTree, function (state, action) {
  if (action.payload.error) {
    return this.handleError(state, action);
  }
  var connectionStatus = state.connectionStatus;
  if (state.phasesLoaded) {
    connectionStatus = _constants.CONNECTION_STATUS.CONNECTED; // TODO why CONNECTION_STATUS.CONNECTED?
  }
  return _extends({}, this.getDataTree(_extends({}, state), action), {
    treeLoaded: true,
    connectionStatus: connectionStatus
  });
}), _defineProperty(_createReducer, SimplActions.updateScope, function (state, action) {
  var key = action.payload.resource_name;
  var data = _extends({}, action.payload.data, { pk: action.payload.pk });
  var index = state[key].findIndex(function (scope) {
    return scope.pk === action.payload.pk;
  });
  if (index === -1) {
    return state;
  }
  var newCollection = (0, _collections.updateInCollection)(state[key], index, data);

  return _extends({}, state, _defineProperty({}, key, newCollection));
}), _defineProperty(_createReducer, SimplActions.getCurrentRunPhase, function (state, action) {
  var runState = this.addChild(state, { payload: action.payload.run });

  return _extends({}, runState, {
    current: {
      run: action.payload.run.pk,
      phase: action.payload.phase.pk
    }
  });
}), _defineProperty(_createReducer, SimplActions.getCurrentRunUserInfo, function (state, action) {
  // Get the current user's info into the current_runuser namespace
  if (state.runuser.length == 0) {
    throw "Runusers aren't loaded yet. You need to call `getRunUsers` before calling `getRunUserInfo`.";
  }
  var simpl_id = action.payload;
  var roleTypes = new Set();
  var currentRunUser = void 0;
  state.runuser.forEach(function (runuser) {
    if (runuser.user === simpl_id) {
      currentRunUser = runuser; // fairly useless unless runuser is a player
    }
    if (!(0, _lodash.isNil)(runuser.role_name)) {
      // runuser is a player
      roleTypes.add(runuser.role_name);
    }
  });
  if (!(0, _lodash.isNil)(currentRunUser) && !(0, _lodash.isNil)(currentRunUser.role_name)) {
    // Remove current runuser's role and we're left with the "other" role names
    roleTypes.delete(currentRunUser.role_name);
    currentRunUser.other_roles = Array.from(roleTypes);
  }
  return _extends({}, state, { current_runuser: currentRunUser });
}), _defineProperty(_createReducer, SimplActions.getRunUserScenarios, function (state, action) {
  var _this3 = this;

  if (action.payload.error) {
    return this.handleError(state, action);
  }
  var connectionStatus = state.connectionStatus;
  if (state.treeLoaded && state.rolesLoaded && state.phasesLoaded) {
    connectionStatus = _constants.CONNECTION_STATUS.LOADED;
  }
  var scenarios = action.payload;
  var newState = _extends({}, state);
  scenarios.forEach(function (scenario) {
    newState = _this3.getDataTree(newState, { payload: scenario });
  });
  // return newState;
  return _extends({}, newState, {
    scenariosLoaded: true,
    connectionStatus: connectionStatus
  });
}), _defineProperty(_createReducer, SimplActions.getPhases, function (state, action) {
  var connectionStatus = state.connectionStatus;
  if (state.treeLoaded && state.rolesLoaded && state.scenariosLoaded) {
    connectionStatus = _constants.CONNECTION_STATUS.LOADED;
  }
  return _extends({}, state, {
    phase: action.payload,
    phasesLoaded: true,
    connectionStatus: connectionStatus
  });
}), _defineProperty(_createReducer, SimplActions.getRoles, function (state, action) {
  var connectionStatus = state.connectionStatus;
  if (state.treeLoaded && state.phasesLoaded && state.scenariosLoaded) {
    connectionStatus = _constants.CONNECTION_STATUS.LOADED;
  }
  return _extends({}, state, {
    role: action.payload,
    rolesLoaded: true,
    connectionStatus: connectionStatus
  });
}), _defineProperty(_createReducer, SimplActions.setConnectionStatus, function (state, action) {
  return _extends({}, state, { connectionStatus: action.payload });
}), _defineProperty(_createReducer, SimplActions.showGenericError, function (state, action) {
  var error = { msg: action.payload[0] };
  var errors = [].concat(_toConsumableArray(state.errors), [error]);
  return _extends({}, state, { errors: errors });
}), _defineProperty(_createReducer, SimplActions.popError, function (state) {
  var errors = [].concat(_toConsumableArray(state.errors));
  errors.pop();
  return _extends({}, state, { errors: errors });
}), _createReducer)), '' + StateActions.recycleState);

exports.default = simpl;