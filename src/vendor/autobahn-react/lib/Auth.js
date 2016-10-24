'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _autobahn = require('autobahn');

var _autobahn2 = _interopRequireDefault(_autobahn);

var _ConnectionJs = require('./Connection.js');

var _ConnectionJs2 = _interopRequireDefault(_ConnectionJs);

var Auth = {
  currentUser: null,
  _signupRoute: 'com.auth.signup',
  _createTokenRoute: 'com.auth.create_token',

  setSignupRoute: function setSignupRoute(newRoute) {
    this._signupRoute = newRoute;
  },

  setTokenCreationRoute: function setTokenCreationRoute(newRoute) {
    this._createTokenRoute = newRoute;
  },

  _onOpened: function _onOpened(args) {
    var session = args[0];
    var details = args[1];

    this.currentUser = {
      session_id: session.id,
      id: details.authid,
      role: details.authrole,
      provider: details.authprovider,
      method: details.authmethod
    };

    return _Promise.resolve([session, this.currentUser]);
  },

  _onClosed: function _onClosed() {
    this.currentUser = null;
    return _Promise.reject(Array.prototype.slice.call(arguments));
  },

  signUp: function signUp(userPayload) {
    var session = _ConnectionJs2['default'].currentConnection.session;
    return session.call(this._signupRoute, [userPayload]);
  },

  logIn: function logIn(credentials) {
    if (!credentials.username || !credentials.password) {
      throw new Error('One of credentials can\'t be null!');
    }

    return _ConnectionJs2['default'].reconnectWithAuth(credentials.username, credentials.password).then(this._onOpened.bind(this))['catch'](this._onClosed.bind(this));
  },

  isLogged: function isLogged() {
    return this.currentUser !== null;
  },

  createToken: function createToken() {
    var session = _ConnectionJs2['default'].currentConnection.session;
    return session.call(this._createTokenRoute, Array.prototype.slice.call(arguments), { disclose_me: true });
  },

  become: function become(token) {
    return _ConnectionJs2['default'].reconnectWithToken(token).then(this._onOpened.bind(this))['catch'](this._onClosed.bind(this));
  },

  canAccess: function canAccess(route) {
    var session = _ConnectionJs2['default'].currentConnection.session;
    return session.call(route, []).then(function () {
      return _Promise.resolve(true);
    })['catch'](function () {
      return _Promise.resolve(false);
    });
  }
};
exports.Auth = Auth;