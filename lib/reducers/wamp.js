'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxCreateReducer = require('redux-create-reducer');

var _reduxRecycle = require('redux-recycle');

var _reduxRecycle2 = _interopRequireDefault(_reduxRecycle);

var _autobahnReact = require('autobahn-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StateActions = require('../actions/state');

var initial = {
  Autobahn: _autobahnReact.Autobahn
};

var wamp = (0, _reduxRecycle2.default)((0, _reduxCreateReducer.createReducer)(initial, {}), '' + StateActions.recycleState);

exports.default = wamp;