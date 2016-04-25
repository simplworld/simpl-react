"use strict";

var _Promise = require("babel-runtime/core-js/promise")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _autobahn = require("autobahn");

var _autobahn2 = _interopRequireDefault(_autobahn);

var Connection = {
  _url: null,
  _realm: null,
  _unreachableHandlers: [],
  _lostHandlers: [],
  _errorHandlers: [],
  _readyHandlers: [],
  _currentConnection: null,

  connect: function connect() {
    var _this = this;

    var promise = new _Promise(function (resolve, reject) {
      _this._currentConnection.onopen = (function (session, details) {
        for (var i = 0; i < this._readyHandlers.length; i++) {
          this._readyHandlers[i]([session, details]);
        }
        resolve([session, details]);
      }).bind(_this);

      _this._currentConnection.onclose = function (reason, details) {
        if (reason === "unreachable") {
          console.log("Server unreachable", details);
          reject(details);
          for (var i = 0; i < _this._unreachableHandlers.length; i++) {
            _this._unreachableHandlers[i](details);
          }
        } else if (reason === "lost") {
          console.log("Connection lost", details);
          for (var i = 0; i < _this._lostHandlers.length; i++) {
            _this._lostHandlers[i](details);
          }
        } else {
          console.log("Connection closed", reason, details);
          for (var i = 0; i < _this._errorHandlers.length; i++) {
            _this._errorHandlers[i]([reason, details]);
          }
        }
      };

      _this._currentConnection.open();
    });
    return promise;
  },

  onUnreachable: function onUnreachable(callback) {
    this._unreachableHandlers.push(callback);
    return this;
  },

  onLost: function onLost(callback) {
    this._lostHandlers.push(callback);
    return this;
  },

  onReady: function onReady(callback) {
    this._readyHandlers.push(callback);
    return this;
  },

  onError: function onError(callback) {
    this._errorHandlers.push(callback);
    return this;
  },

  makeConnection: function makeConnection(params) {
    if (this._currentConnection && this._currentConnection.isOpen) {
      this._currentConnection.close();
    }

    this._currentConnection = new _autobahn2["default"].Connection(params);
  },

  initialize: function initialize(url, realm) {
    this._url = url;
    this._realm = realm;
    this.makeConnection({ url: url, realm: realm });
  },

  reconnectAnonymously: function reconnectAnonymously() {
    this.makeConnection({ url: this._url, realm: this._realm });
    return this.connect();
  },

  reconnectWithToken: function reconnectWithToken(authid, token) {
    function onchallenge(session, method, extra) {
      if (method !== "ticket") {
        throw new Error("Unknown authentication method: " + method + " ?!");
      }

      return token;
    }

    this.makeConnection({ url: this._url, realm: this._realm, authmethods: ["ticket"], authid: authid, onchallenge: onchallenge });
    return this.connect();
  },

  reconnectWithAuth: function reconnectWithAuth(authid, secret) {
    function onchallenge(session, method, extra) {
      if (method !== "wampcra") {
        throw new Error("Unknown authentication method: " + method + " ?!");
      }

      if ("salt" in extra) {
        _autobahn2["default"].auth_cra.derive_key(secret, extra.salt);
      }

      return _autobahn2["default"].auth_cra.sign(secret, extra.challenge);
    }

    this.makeConnection({ url: this._url, realm: this._realm, authmethods: ["wampcra"], authid: authid, onchallenge: onchallenge });
    return this.connect();
  }
};

Object.defineProperty(Connection, "currentConnection", {
  enumerable: false,
  writeable: false,
  get: function get() {
    if (Connection._currentConnection && Connection._currentConnection.isOpen) {
      return Connection._currentConnection;
    } else {
      throw new Error("Autobahn isn't initialized yet!");
    }
  }
});

exports["default"] = Connection;
module.exports = exports["default"];
