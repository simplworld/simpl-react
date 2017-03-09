'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.wampSetup = wampSetup;
exports.wampOptionsWithDefaults = wampOptionsWithDefaults;

var _autobahn = require('../autobahn');

var _autobahn2 = _interopRequireDefault(_autobahn);

var _Progress = require('../components/Progress.react');

var _Progress2 = _interopRequireDefault(_Progress);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wampSetup(component, options) {
  // Callback called whenever the connection is lost
  _autobahn2.default.Connection.onLost(function () {
    console.log('Connection lost :/!');
    component.props.setConnectionStatus(_constants.CONNECTION_STATUS.OFFLINE);
  });
  // Callback called whenever the connection is ready
  // eslint-disable-next-line no-unused-vars
  _autobahn2.default.Connection.onReady(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        session = _ref2[0],
        details = _ref2[1];

    console.log('Connection established!');
    Object.keys(options.prefixes).forEach(function (key) {
      var value = options.prefixes[key];
      console.log('added prefix: ', key, value);
      session.prefix(key, value);
      component.props.setConnectionStatus(_constants.CONNECTION_STATUS.CONNECTED);
    });
  });
  _autobahn2.default.Connection.initialize(options.url, options.realm);
  if (options.authid) {
    _autobahn2.default.Auth.logIn({
      username: options.authid,
      password: options.password
    }).then(function () {
      console.log('authd');
      if (component.props.onReady) {
        component.props.onReady();
      }
    }).catch(function (err) {
      console.log(err);
      console.log('not authd');
    });
  }
}

function wampOptionsWithDefaults(options) {
  var defaults = {
    url: 'ws://localhost:8080/ws',
    realm: 'realm1',
    prefixes: {},
    progressComponent: _Progress2.default
  };
  return _extends({}, defaults, options);
}