'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.simpl = simpl;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reduxForm = require('redux-form');

var _simpl = require('../actions/simpl');

var _Progress = require('../components/Progress.react');

var _Progress2 = _interopRequireDefault(_Progress);

var _subscribes = require('./pubsub/subscribes');

var _wamp = require('./wamp');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _autobahn = require('../autobahn');

var _autobahn2 = _interopRequireDefault(_autobahn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Decorator to wrap your main app
 * @example
 * export default simpl({
 *   username: 'username',
 *   password: 'password',
 *   url: 'ws://example.com/ws',
 *   progressComponent: MyProgressComponent,
 *   topics: () => ['topic1', 'topic2'],
 *   prefixes: {
 *     model: 'org.example.namespace'
 *   }
 * })(MyComponent);

 * @function
 * @memberof Simpl.decorators
 * @param {Object} options - An object of options.
 * @param {string} options.username - The username for authenticating on the WAMP Router.
 * @param {string} options.password - The password for authenticating on the WAMP Router.
 * @param {string} options.url - The URL of the WAMP router.
 * @param {function} [options.progressComponent] - A customized Component to show
 * the App's connection state. The component will receive a `progress` prop which
 * can have one of the following values:
 * * `offline`: The initial value. The app is not connected to the WAMP Router, yet.
 * * `connected`: The app is connected and authenticated, but it still needs to download data.
 * * `loaded`: The app has downloaded all the relevant data.
 * @param {function} options.topics - A function return a list of topic to subsribe to.
 * @param {Object} [options.prefixes] - An object mapping names to topic prefixes,
 * to be used as shortcuts.
 */
function simpl(options) {
  return function (Component) {
    var optionsWithDefaults = _extends({}, {
      progressComponent: _Progress2.default
    }, options);
    if (_lodash2.default.isFunction(options.topics)) {
      optionsWithDefaults.topics = options.topics();
    }

    var mapStateToProps = function mapStateToProps(state, ownProps) {
      return {
        progress: state.simpl.loaded === true ? 'loaded' : ownProps.progress,
        errors: state.errors,
        progressComponent: optionsWithDefaults.progressComponent
      };
    };

    var mapDispatchToProps = function mapDispatchToProps(dispatch) {
      return {
        onReady: function onReady() {
          if (optionsWithDefaults.topics) {
            optionsWithDefaults.topics.forEach(function (topic) {
              dispatch((0, _simpl.connectedScope)(topic));
              dispatch((0, _simpl.getRunUsers)(topic));
              dispatch((0, _simpl.getCurrentRunPhase)(topic));
              dispatch((0, _simpl.getDataTree)(topic));
            });
          }
          dispatch((0, _simpl.getPhases)('model:model.game'));
          dispatch((0, _simpl.getRoles)('model:model.game'));
          return Promise.resolve();
        },
        onLeave: function onLeave() {
          if (optionsWithDefaults.topics) {
            optionsWithDefaults.topics.forEach(function (topic) {
              dispatch((0, _simpl.disconnectedScope)(topic));
            });
          }
          return Promise.resolve();
        },
        onReceived: function onReceived(args, kwargs, event) {
          if (kwargs.error) {
            if (kwargs.error === 'application.error.validation_error') {
              var _args = _slicedToArray(args, 2),
                  form = _args[0],
                  errors = _args[1];

              dispatch((0, _reduxForm.stopSubmit)(form, errors));
            } else {
              dispatch((0, _simpl.showGenericError)(args, kwargs));
            }
          } else {
            (function () {
              var _args2 = _slicedToArray(args, 3),
                  pk = _args2[0],
                  resourceName = _args2[1],
                  data = _args2[2];

              var resolvedTopics = optionsWithDefaults.topics.map(function (topic) {
                return _autobahn2.default.Connection.currentConnection.session.resolve(topic);
              });
              resolvedTopics.forEach(function (topic) {
                var _actions;

                var actions = (_actions = {}, _defineProperty(_actions, topic + '.add_child', _simpl.addChild), _defineProperty(_actions, topic + '.remove_child', _simpl.removeChild), _defineProperty(_actions, topic + '.update_child', _simpl.updateScope), _actions);
                if (actions[event.topic]) {
                  dispatch(actions[event.topic]({ resource_name: resourceName, data: data, pk: pk }));
                }
              });
            })();
          }
        }
      };
    };

    var AppContainer = function (_React$Component) {
      _inherits(AppContainer, _React$Component);

      function AppContainer() {
        _classCallCheck(this, AppContainer);

        return _possibleConstructorReturn(this, (AppContainer.__proto__ || Object.getPrototypeOf(AppContainer)).apply(this, arguments));
      }

      _createClass(AppContainer, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
          if (this.props.progress === 'loaded') {
            return false;
          }
          return this.props !== nextProps || this.state !== nextState;
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(Component, _extends({}, this.props, this.state));
        }
      }]);

      return AppContainer;
    }(_react2.default.Component);

    AppContainer.propTypes = {
      progress: _react2.default.PropTypes.string.isRequired
    };

    var appTopics = optionsWithDefaults.topics.reduce(function (memo, topic) {
      return memo.concat([topic + '.add_child', topic + '.update_child', topic + '.remove_child']);
    }, ['model:error.' + options.username]);
    var SubscribedAppContainer = (0, _subscribes.subscribes)(appTopics)(AppContainer);

    // eslint-disable-next-line react/no-multi-comp

    var Simpl = function (_React$Component2) {
      _inherits(Simpl, _React$Component2);

      function Simpl() {
        _classCallCheck(this, Simpl);

        return _possibleConstructorReturn(this, (Simpl.__proto__ || Object.getPrototypeOf(Simpl)).apply(this, arguments));
      }

      _createClass(Simpl, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          this.props.onReady();
          window.addEventListener('beforeunload', this.props.onLeave);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          window.removeEventListener('beforeunload', this.props.onLeave);
        }
      }, {
        key: 'render',
        value: function render() {
          if (this.props.progress !== 'loaded') {
            return _react2.default.createElement(
              'div',
              { className: 'simpl simpl-' + this.props.progress },
              _react2.default.createElement(this.props.progressComponent, _extends({}, this.props, this.state))
            );
          }
          return _react2.default.createElement(
            'div',
            { className: 'simpl simpl-' + this.props.progress },
            _react2.default.createElement(SubscribedAppContainer, _extends({}, this.props, this.state))
          );
        }
      }]);

      return Simpl;
    }(_react2.default.Component);

    Simpl.propTypes = {
      progress: _react2.default.PropTypes.string.isRequired,
      onLeave: _react2.default.PropTypes.func,
      onReady: _react2.default.PropTypes.func.isRequired,
      progressComponent: _react2.default.PropTypes.func.isRequired
    };

    var SimplContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Simpl);
    var WampContainer = (0, _wamp.wamp)(optionsWithDefaults)(SimplContainer);

    return WampContainer;
  };
}

/**
 * @namespace simpl
 * @memberof Simpl.decorators
 */
exports.default = simpl;