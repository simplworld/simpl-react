'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createReducer;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reduxCreateReducer = require('redux-create-reducer');

var _reduxRecycle = require('redux-recycle');

var _reduxRecycle2 = _interopRequireDefault(_reduxRecycle);

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
  role: []
};

var simpl = (0, _reduxRecycle2.default)((0, _reduxCreateReducer.createReducer)(initial, (_createReducer = {
  handleError: function handleError(state, action) {
    console.error(action.payload.error, action.payload.args, action.payload.kwargs);
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
  var updated = (0, _collections.popAtIndex)(state[key], index);
  return _extends({}, state, _defineProperty({}, key, updated));
}), _defineProperty(_createReducer, SimplActions.getRunUsers, function (state, action) {
  var _this2 = this;

  if (action.payload.error) {
    return this.handleError(state, action);
  }
  return action.payload.reduce(function (memo, child) {
    return _this2.addChild(memo, { payload: child });
  }, _extends({}, state));
}), _defineProperty(_createReducer, SimplActions.getDataTree, function (state, action) {
  if (action.payload.error) {
    return this.handleError(state, action);
  }
  var loaded = state.loaded;
  if (state.phasesLoaded) {
    loaded = true;
  }
  return _extends({}, this.getDataTree(_extends({}, state), action), {
    treeLoaded: true,
    loaded: loaded
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
}), _defineProperty(_createReducer, SimplActions.getUserInfo, function (state, action) {
  // Get the current user's info into the user namespace
  var username = action.payload;
  var role_types = new Set();
  var found_runuser;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = state.runuser[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var runuser = _step.value;

      if (runuser.role_name) {
        role_types.add(runuser.role_name);
      }

      if (runuser.username == username) {
        found_runuser = runuser;
      }
    }

    // Remove this user's role and we're left with the "other" role names
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  role_types.delete(found_runuser.role_name);
  found_runuser.other_roles = Array.from(role_types);
  return _extends({}, state, { user: found_runuser });
}), _defineProperty(_createReducer, SimplActions.getPhases, function (state, action) {
  var loaded = state.loaded;
  if (state.treeLoaded && state.rolesLoaded) {
    loaded = true;
  }
  return _extends({}, state, {
    phase: action.payload,
    phasesLoaded: true,
    loaded: loaded
  });
}), _defineProperty(_createReducer, SimplActions.getRoles, function (state, action) {
  var loaded = state.loaded;
  if (state.treeLoaded && state.phasesLoaded) {
    loaded = true;
  }
  return _extends({}, state, {
    role: action.payload,
    rolesLoaded: true,
    loaded: loaded
  });
}), _createReducer)), '' + StateActions.recycleState);

exports.default = simpl;