"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wampSetup = wampSetup;
exports.wampOptionsWithDefaults = wampOptionsWithDefaults;

var _autobahn = _interopRequireDefault(require("../autobahn"));

var _Progress = _interopRequireDefault(require("../components/Progress.react"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function wampSetup(component, options) {
  // Callback called whenever the connection is lost
  _autobahn.default.Connection.onLost(function () {
    console.log('Connection lost :/!');
    component.props.setConnectionStatus(_constants.CONNECTION_STATUS.OFFLINE);
  }); // Callback called whenever the connection is ready
  // eslint-disable-next-line no-unused-vars


  _autobahn.default.Connection.onReady(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        session = _ref2[0],
        details = _ref2[1];

    console.log('Connection established!');
    session.prefix('model', options.root_topic);
    Object.keys(options.prefixes).forEach(function (key) {
      var value = options.prefixes[key];
      console.log('added prefix: ', key, value);
      session.prefix(key, value);
      component.props.setConnectionStatus(_constants.CONNECTION_STATUS.CONNECTED);
    });
  });

  _autobahn.default.Connection.makeConnection({
    url: options.url,
    realm: options.realm,
    authmethods: ['ticket'],
    authid: options.authid,
    onchallenge: function onchallenge() {
      return options.password;
    }
  });

  _autobahn.default.Connection.connect().then(function () {
    console.log("Authentication as authid=".concat(options.authid, " successful!"));

    if (component.props.onReady) {
      component.props.onReady();
    }
  }).catch(function (err) {
    console.log(err);
    console.log("Unable to authenticate as authid=".concat(options.authid));
  });
}

function wampOptionsWithDefaults(options) {
  var defaults = {
    url: 'ws://localhost:8080/ws',
    realm: 'realm1',
    authmethods: ['ticket'],
    prefixes: {},
    progressComponent: _Progress.default
  };
  return _extends({}, defaults, options);
}