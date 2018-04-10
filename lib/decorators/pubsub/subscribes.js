'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.subscribes = subscribes;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _autobahn = require('../../autobahn');

var _autobahn2 = _interopRequireDefault(_autobahn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @function subscribes
 * @memberof Simpl.decorators.pubsub
 */
function subscribes(topics) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var staticMethods = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return function (Component) {
    var defaults = { match: 'prefix' };
    var optionsWithDefaults = _extends(defaults, {}, options);

    var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
      return {
        onMessage: function onMessage(args, kwargs, event) {
          var store = ownProps.append === undefined ? true : ownProps.append;
          var action = store ? this.appendMessage : this.updateMessage;

          action({ args: args, kwargs: kwargs, event: event });
          if (ownProps.onReceived !== undefined) {
            ownProps.onReceived(args, kwargs, event);
          }
        }
      };
    };

    var SubscriptionContainer = function (_React$Component) {
      _inherits(SubscriptionContainer, _React$Component);

      function SubscriptionContainer(props) {
        _classCallCheck(this, SubscriptionContainer);

        var _this = _possibleConstructorReturn(this, (SubscriptionContainer.__proto__ || Object.getPrototypeOf(SubscriptionContainer)).call(this, props));

        _this.state = {
          data: []
        };
        _this.appendMessage = _this.appendMessage.bind(_this);
        _this.updateMessage = _this.updateMessage.bind(_this);
        return _this;
      }

      _createClass(SubscriptionContainer, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          this.subscriptions = [];
          // eslint-disable-next-line no-unused-vars
          _autobahn2.default.Connection.onReady(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                session = _ref2[0],
                details = _ref2[1];

            _this2.subscribeTo(session);
          });
          this.subscribeTo(_autobahn2.default);
        }
      }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
          return this.props !== nextProps || this.state !== nextState;
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var resolvedTopics = this.getTopics();
          console.log('Unmounting ' + resolvedTopics);
          this.unsubscribe();
        }
      }, {
        key: 'getTopics',
        value: function getTopics() {
          var _this3 = this;

          var resolvedTopics = void 0;
          if (!_lodash2.default.isArray(topics)) {
            resolvedTopics = [topics];
          } else {
            resolvedTopics = [].concat(_toConsumableArray(topics));
          }
          return resolvedTopics.map(function (topic) {
            if (_lodash2.default.isFunction(topic)) {
              return topic.bind(_this3)(_this3.props);
            }
            return topic;
          });
        }
      }, {
        key: 'subscribeTo',
        value: function subscribeTo(session) {
          var _this4 = this;

          var handler = this.props.onMessage.bind(this);
          var resolvedTopics = this.getTopics();
          console.log('subscribeTo: resolvedTopics:', resolvedTopics);
          resolvedTopics.forEach(function (topic) {
            session.subscribe(topic, handler, optionsWithDefaults).then(function (subscription) {
              _this4.subscriptions.push(subscription);
              console.log('Subscribed to ' + topic);
            }).catch(function (error) {
              console.error('Failed to auto-subscribe to a topic: ' + topic + '!', error);
            });
          });
        }
      }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
          this.subscriptions.forEach(function (subscription) {
            console.log('Unsubscribing from \'' + subscription.topic + '\'');
            _autobahn2.default.unsubscribe(subscription);
          });
        }
      }, {
        key: 'appendMessage',
        value: function appendMessage(message) {
          var newVar = [].concat(_toConsumableArray(this.state.data || []), [message]);

          this.setState({
            data: newVar
          });
        }
      }, {
        key: 'updateMessage',
        value: function updateMessage(message) {
          this.setState({
            data: message
          });
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(Component, _extends({}, this.props, this.state));
        }
      }]);

      return SubscriptionContainer;
    }(_react2.default.Component);

    SubscriptionContainer.propTypes = {
      append: _propTypes2.default.bool,
      options: _propTypes2.default.object,
      onMessage: _propTypes2.default.func
    };

    for (var functionName in staticMethods) {
      SubscriptionContainer[functionName] = staticMethods[functionName];
    }

    return (0, _reactRedux.connect)(null, mapDispatchToProps)(SubscriptionContainer);
  };
}

exports.default = subscribes;