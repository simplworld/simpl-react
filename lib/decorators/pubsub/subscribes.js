"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribes = subscribes;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _lodash = _interopRequireDefault(require("lodash"));

var _autobahn = _interopRequireDefault(require("../../autobahn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * @function subscribes
 * @memberof Simpl.decorators.pubsub
 */
function subscribes(topics) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var staticMethods = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (Component) {
    var defaults = {
      match: 'prefix'
    };

    var optionsWithDefaults = _extends(defaults, {}, options);

    var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
      return {
        onMessage: function onMessage(args, kwargs, event) {
          var store = ownProps.append === undefined ? true : ownProps.append;
          var action = store ? this.appendMessage : this.updateMessage;
          action({
            args: args,
            kwargs: kwargs,
            event: event
          });

          if (ownProps.onReceived !== undefined) {
            ownProps.onReceived(args, kwargs, event);
          }
        }
      };
    };

    var SubscriptionContainer =
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(SubscriptionContainer, _React$Component);

      function SubscriptionContainer(props) {
        var _this;

        _classCallCheck(this, SubscriptionContainer);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(SubscriptionContainer).call(this, props));
        _this.state = {
          data: []
        };
        _this.appendMessage = _this.appendMessage.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.updateMessage = _this.updateMessage.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        return _this;
      }

      _createClass(SubscriptionContainer, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this2 = this;

          this.subscriptions = []; // eslint-disable-next-line no-unused-vars

          _autobahn.default.Connection.onReady(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                session = _ref2[0],
                details = _ref2[1];

            _this2.subscribeTo(session);
          });

          this.subscribeTo(_autobahn.default);
        }
      }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps, nextState) {
          return this.props !== nextProps || this.state !== nextState;
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          var resolvedTopics = this.getTopics();
          console.log("Unmounting ".concat(resolvedTopics));
          this.unsubscribe();
        }
      }, {
        key: "getTopics",
        value: function getTopics() {
          var _this3 = this;

          var resolvedTopics;

          if (!_lodash.default.isArray(topics)) {
            resolvedTopics = [topics];
          } else {
            resolvedTopics = _toConsumableArray(topics);
          }

          return resolvedTopics.map(function (topic) {
            if (_lodash.default.isFunction(topic)) {
              return topic.bind(_this3)(_this3.props);
            }

            return topic;
          });
        }
      }, {
        key: "subscribeTo",
        value: function subscribeTo(session) {
          var _this4 = this;

          var handler = this.props.onMessage.bind(this);
          var resolvedTopics = this.getTopics();
          console.log("subscribeTo: resolvedTopics:", resolvedTopics);
          resolvedTopics.forEach(function (topic) {
            session.subscribe(topic, handler, optionsWithDefaults).then(function (subscription) {
              _this4.subscriptions.push(subscription);

              console.log("Subscribed to ".concat(topic));
            }).catch(function (error) {
              console.error("Failed to auto-subscribe to a topic: ".concat(topic, "!"), error);
            });
          });
        }
      }, {
        key: "unsubscribe",
        value: function unsubscribe() {
          this.subscriptions.forEach(function (subscription) {
            console.log("Unsubscribing from '".concat(subscription.topic, "'"));

            _autobahn.default.unsubscribe(subscription);
          });
        }
      }, {
        key: "appendMessage",
        value: function appendMessage(message) {
          var newVar = _toConsumableArray(this.state.data || []).concat([message]);

          this.setState({
            data: newVar
          });
        }
      }, {
        key: "updateMessage",
        value: function updateMessage(message) {
          this.setState({
            data: message
          });
        }
      }, {
        key: "render",
        value: function render() {
          return _react.default.createElement(Component, _extends({}, this.props, this.state));
        }
      }]);

      return SubscriptionContainer;
    }(_react.default.Component);

    SubscriptionContainer.propTypes = {
      append: _propTypes.default.bool,
      options: _propTypes.default.object,
      onMessage: _propTypes.default.func
    };

    for (var functionName in staticMethods) {
      SubscriptionContainer[functionName] = staticMethods[functionName];
    }

    return (0, _reactRedux.connect)(null, mapDispatchToProps)(SubscriptionContainer);
  };
}

var _default = subscribes;
exports.default = _default;