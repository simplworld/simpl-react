'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ConnectionJs = require('./Connection.js');

var _ConnectionJs2 = _interopRequireDefault(_ConnectionJs);

var _AuthJs = require('./Auth.js');

var _DecoratorsJs = require('./Decorators.js');

var Decorators = _interopRequireWildcard(_DecoratorsJs);

var Autobahn = {
  Auth: _AuthJs.Auth,
  Connection: _ConnectionJs2['default'],
  Decorators: Decorators,
  initialize: function initialize(url, realm) {
    if (_ConnectionJs2['default']._currentConnection) {
      throw new Error('Autobahn is already initialized!');
    }

    _ConnectionJs2['default'].initialize(url, realm);
    return _ConnectionJs2['default'].reconnectAnonymously();
  },
  browserInitialize: function browserInitialize(port, path, realm) {
    return this.initialize('ws://' + document.location.hostname + ':' + port + '/' + path, realm);
  },
  isConnectionReady: function isConnectionReady() {
    return _ConnectionJs2['default'].currentConnection && _ConnectionJs2['default'].currentConnection.isOpen;
  },
  publish: function publish() {
    var _Connection$currentConnection$session;

    return (_Connection$currentConnection$session = _ConnectionJs2['default'].currentConnection.session).publish.apply(_Connection$currentConnection$session, arguments);
  },
  subscribe: function subscribe() {
    var _Connection$currentConnection$session2;

    return (_Connection$currentConnection$session2 = _ConnectionJs2['default'].currentConnection.session).subscribe.apply(_Connection$currentConnection$session2, arguments);
  },
  unsubscribe: function unsubscribe() {
    var _Connection$currentConnection$session3;

    return (_Connection$currentConnection$session3 = _ConnectionJs2['default'].currentConnection.session).unsubscribe.apply(_Connection$currentConnection$session3, arguments);
  },
  call: function call() {
    var _Connection$currentConnection$session4;

    return (_Connection$currentConnection$session4 = _ConnectionJs2['default'].currentConnection.session).call.apply(_Connection$currentConnection$session4, arguments);
  },
  register: function register() {
    var _Connection$currentConnection$session5;

    return (_Connection$currentConnection$session5 = _ConnectionJs2['default'].currentConnection.session).register.apply(_Connection$currentConnection$session5, arguments);
  },
  unregister: function unregister() {
    var _Connection$currentConnection$session6;

    return (_Connection$currentConnection$session6 = _ConnectionJs2['default'].currentConnection.session).unregister.apply(_Connection$currentConnection$session6, arguments);
  }
};

exports['default'] = Autobahn;
module.exports = exports['default'];
