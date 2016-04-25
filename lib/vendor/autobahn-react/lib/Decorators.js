'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.requireSubscriptions = requireSubscriptions;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ConnectionJs = require('./Connection.js');

var _ConnectionJs2 = _interopRequireDefault(_ConnectionJs);

function requireSubscriptions(Component) {
  var staticMethods = arguments[1] === undefined ? {} : arguments[1];

  var highOrderComponent = (function (_React$Component) {
    var _class = function highOrderComponent(props) {
      _classCallCheck(this, _class);

      _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props);

      this.state = {
        data: {}
      };
      this.subscriptions = [];
      this.subscriptionsMeta = {};
    };

    _inherits(_class, _React$Component);

    _createClass(_class, [{
      key: 'onPublished',
      value: function onPublished(variable, args, kwargs, details) {
        var _this = this;

        this.setState(function (previousState, curProps) {
          if (_this.subscriptionsMeta[variable].store) {
            previousState.data[variable].push({ args: args, kwargs: kwargs, details: details });
          } else {
            previousState.data[variable] = { args: args, kwargs: kwargs, details: details };
          }
          return previousState;
        });
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        var routes = Component.observeSubscriptions();
        for (var variable in routes) {
          _ConnectionJs2['default'].currentConnection.session.subscribe(routes[variable].route, this.onPublished.bind(this, variable)).then(function (subscription) {
            _this2.subscriptions.push(subscription);

            var isStore = routes[variable].store || false;
            _this2.subscriptionsMeta[variable] = { store: isStore };
            _this2.setState(function (previousState, curProps) {
              if (isStore) {
                previousState.data[variable] = [];
              } else {
                previousState.data[variable] = {};
              }
            });
          })['catch'](function (error) {
            console.error('Failed to auto-subscribe to a topic: ' + routes[variable] + ' !', error);
          });
        }
      }
    }, {
      key: 'componentDidUnmount',
      value: function componentDidUnmount() {
        var routes = Component.observeSubscriptions();
        this.subscriptions.foreach(function (subscription) {
          _ConnectionJs2['default'].currentConnection.session.subscribe(subscription);
        });
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2['default'].createElement(Component, _extends({ data: this.state.data }, this.props));
      }
    }]);

    return _class;
  })(_react2['default'].Component);

  for (var functionName in staticMethods) {
    highOrderComponent[functionName] = staticMethods[functionName];
  }

  return highOrderComponent;
}