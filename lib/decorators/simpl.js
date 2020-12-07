"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simpl = simpl;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _lodash = _interopRequireDefault(require("lodash"));

var _autobahn = _interopRequireDefault(require("../autobahn"));

var _simpl = require("../actions/simpl");

var _constants = require("../constants");

var _subscribes = require("./pubsub/subscribes");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Decorator to wrap your main app
 * @example
 * export default simpl({
 *   authid: 123,
 *   password: 'password',
 *   url: 'ws://example.com/ws',
 *   progressComponent: MyProgressComponent,
 *   topics: () => ['topic1', 'topic2'],
 *   root_topic: 'org.example.namespace',
 *   prefixes: {
 *     special: 'org.example.namespace.special.shortcut'
 *   },
 *   loadAllScenarios: false
 *   loadRunDataOnDemand: false
 * })(MyComponent);

 * @function
 * @memberof Simpl.decorators
 * @param {Object} options - An object of options.
 * @param {string} options.authid - The user id for authenticating on the WAMP
 * Router. This will the user's id on Simpl-Games-Api
 * @param {string} options.password - The password for authenticating on the
 * WAMP Router.
 * @param {string} options.url - The URL of the WAMP router.
 * @param {function} [options.progressComponent] - A customized Component to
 * show the App's connection state. The component will receive a
 * `connectionStatus` prop which can have one of the following values:
 * * `connecting`: The initial value. The app is not connected to the WAMP Router, yet.
 * * `connected`: The app is connected and authenticated, but it still needs to download data.
 * * `loaded`: The app has downloaded all the relevant data.
 * * `offline`:  The connection was dropped.
 * @param {function} options.topics - A function returning a list of topics to
 * subscribe to.
 * @param {string} options.root_topic - The root topic for your model. This will
 * be used for the `'model'` prefix.
 * @param {Object} [options.prefixes] - An object mapping names to topic
 * prefixes, to be used as shortcuts.
 * @param {boolean} options.loadAllScenarios - If false, load only world scenarios and this user's Scenarios.
 * If true, load all Scenarios for the subscribed runs.
 * @param {boolean} options.loadRunDataOnDemand - If true, load runs' data on request.
 * If false, load runs' data on login.
 */
function simpl(options) {
  return function (Component) {
    var authid = parseInt(options.authid, 10);
    var optionsWithDefaults = (0, _utils.wampOptionsWithDefaults)(options);

    if (_lodash.default.isFunction(options.topics)) {
      optionsWithDefaults.topics = options.topics();
    }

    if (options.hasOwnProperty('loadAllScenarios')) {
      optionsWithDefaults.loadAllScenarios = options.loadAllScenarios;
    } else {
      optionsWithDefaults.loadAllScenarios = false;
    }

    if (options.hasOwnProperty('loadRunDataOnDemand')) {
      optionsWithDefaults.loadRunDataOnDemand = options.loadRunDataOnDemand;
    } else {
      optionsWithDefaults.loadRunDataOnDemand = false;
    } // console.log(`optionsWithDefaults.loadAllScenarios: ${optionsWithDefaults.loadAllScenarios}`);
    // console.log(`optionsWithDefaults.loadRunDataOnDemand: ${optionsWithDefaults.loadRunDataOnDemand}`);
    // console.log(`optionsWithDefaults.topics:`, optionsWithDefaults.topics);


    var mergeProps = function mergeProps(propsFromState, propsFromDispatch) {
      return _objectSpread({}, propsFromState, propsFromDispatch, {
        onLeave: function onLeave() {
          return propsFromDispatch.onLeaveWithTopics(propsFromState.topics);
        },
        onReceived: function onReceived(args, kwargs, event) {
          return propsFromDispatch.onReceivedWithTopics(args, kwargs, event, propsFromState.topics);
        }
      });
    };

    var mapStateToProps = function mapStateToProps(state) {
      return {
        topics: state.simpl.topics,
        connectionStatus: state.simpl.connectionStatus,
        errors: state.errors,
        progressComponent: optionsWithDefaults.progressComponent
      };
    };

    var mapDispatchToProps = function mapDispatchToProps(dispatch) {
      return {
        setConnectionStatus: function setConnectionStatus(status) {
          dispatch((0, _simpl.setConnectionStatus)(status));
        },
        onReady: function onReady() {
          // console.log(`onReady::`);
          if (optionsWithDefaults.topics) {
            optionsWithDefaults.topics.forEach(function (topic) {
              // console.log(`dispatching connectedScope(${topic})`);
              dispatch((0, _simpl.connectedScope)(topic));
              var excludePlayers = options.loadRunDataOnDemand && topic.includes('run') ? true : false;
              console.log("dispatching getRunUsers(".concat(topic, ", ").concat(excludePlayers, ")"));
              dispatch((0, _simpl.getRunUsers)(topic, excludePlayers)).then(function (action) {
                if (action.error) {
                  throw new Error("".concat(action.payload.error, ": ").concat(action.payload.args.join('; ')));
                }

                var runUsers = action.payload;
                console.log("getRunUsers(".concat(topic, ") -> runUsers:"), runUsers);

                for (var i = 0; i < runUsers.length; i++) {
                  var ru = runUsers[i];
                  var ruTopic = "model:model.runuser.".concat(ru.data.id);

                  if (optionsWithDefaults.loadAllScenarios) {
                    // single player game leaders
                    // console.log(`dispatching getRunUserScenarios(${ruTopic})`);
                    dispatch((0, _simpl.getRunUserScenarios)(ruTopic));

                    if (ru.data.user !== authid) {
                      dispatch((0, _simpl.addTopic)(ruTopic)); // subscribe to other users' runuser topics
                    }
                  } else if (ru.data.user === authid) {
                    // only get this user's scenarios
                    // console.log(`dispatching getRunUserScenarios(${ruTopic})`);
                    dispatch((0, _simpl.getRunUserScenarios)(ruTopic));
                    break;
                  }
                }
              }).then(function () {
                // console.log(`dispatching getCurrentRunUserInfo(${authid})`);
                dispatch((0, _simpl.getCurrentRunUserInfo)(authid));
              }); // console.log(`dispatching getCurrentRunPhase(${topic})`);

              dispatch((0, _simpl.getCurrentRunPhase)(topic));

              if (options.loadRunDataOnDemand && topic.includes('run')) {
                // console.log(`Will load run's worlds on demand.`);
                // console.log(`dispatching getDataTree(${topic}, ['world'])`);
                dispatch((0, _simpl.getDataTree)(topic, ['world']));
              } else {
                // console.log(`dispatching getDataTree(${topic})`);
                dispatch((0, _simpl.getDataTree)(topic));
              } // console.log(`dispatching addTopic(${topic})`);


              dispatch((0, _simpl.addTopic)(topic));
            });
          } // console.log(`dispatching getPhases('model:model.game')`);


          dispatch((0, _simpl.getPhases)('model:model.game')); // console.log(`dispatching getRoles('model:model.game')`);

          dispatch((0, _simpl.getRoles)('model:model.game'));
          return Promise.resolve();
        },
        onLeaveWithTopics: function onLeaveWithTopics(topics) {
          // invoked when navigate between pages -- sometimes
          // console.log(`onLeaveWithTopics:: topics: `, topics);
          if (topics) {
            topics.forEach(function (topic) {
              dispatch((0, _simpl.disconnectedScope)(topic));
            });
          }

          return Promise.resolve();
        },
        onReceivedWithTopics: function onReceivedWithTopics(args, kwargs, event, topics) {
          // invoked on receiving topic events
          // console.log(`onReceivedWithTopics:: args: `, args, `, event: `, event, `, topics: `, topics);
          if (kwargs.error) {
            dispatch((0, _simpl.showGenericError)(args, kwargs));
          } else {
            var _args = _slicedToArray(args, 3),
                pk = _args[0],
                resourceName = _args[1],
                data = _args[2];

            if (topics) {
              var resolvedTopics = topics.map(function (topic) {
                return _autobahn.default.Connection.currentConnection.session.resolve(topic);
              });
              resolvedTopics.forEach(function (topic) {
                var _actions;

                var actions = (_actions = {}, _defineProperty(_actions, "".concat(topic, ".add_child"), _simpl.addChild), _defineProperty(_actions, "".concat(topic, ".remove_child"), _simpl.removeChild), _defineProperty(_actions, "".concat(topic, ".update_child"), _simpl.updateScope), _actions);

                if (actions[event.topic]) {
                  // console.log('dispatching: ', actions[event.topic])
                  dispatch(actions[event.topic]({
                    resource_name: resourceName,
                    data: data,
                    pk: pk
                  }));

                  if (resourceName === 'runuser' && event.topic.endsWith('update_child')) {
                    // Is the updated runuser associated with the current user?
                    if (authid === data.user) {
                      dispatch((0, _simpl.getCurrentRunUserInfo)(authid));
                    }
                  }
                }
              });
            }
          }
        }
      };
    };

    var AppContainer =
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(AppContainer, _React$Component);

      function AppContainer() {
        _classCallCheck(this, AppContainer);

        return _possibleConstructorReturn(this, _getPrototypeOf(AppContainer).apply(this, arguments));
      }

      _createClass(AppContainer, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps, nextState) {
          if (this.props.connectionStatus === _constants.CONNECTION_STATUS.LOADED) {
            return false;
          }

          return this.props !== nextProps || this.state !== nextState;
        }
      }, {
        key: "render",
        value: function render() {
          return _react.default.createElement(Component, _extends({}, this.props, this.state));
        }
      }]);

      return AppContainer;
    }(_react.default.Component);

    AppContainer.propTypes = {
      connectionStatus: _propTypes.default.string.isRequired
    }; // eslint-disable-next-line react/no-multi-comp

    var Simpl =
    /*#__PURE__*/
    function (_React$Component2) {
      _inherits(Simpl, _React$Component2);

      function Simpl() {
        _classCallCheck(this, Simpl);

        return _possibleConstructorReturn(this, _getPrototypeOf(Simpl).apply(this, arguments));
      }

      _createClass(Simpl, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          (0, _utils.wampSetup)(this, optionsWithDefaults);
          window.addEventListener('beforeunload', this.props.onLeave);
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          window.removeEventListener('beforeunload', this.props.onLeave);
        }
      }, {
        key: "render",
        value: function render() {
          var appTopics = this.props.topics.reduce(function (memo, topic) {
            return memo.concat(["".concat(topic, ".add_child"), "".concat(topic, ".update_child"), "".concat(topic, ".remove_child")]);
          }, ["model:error.".concat(options.authid)]);
          var SubscribedAppContainer = (0, _subscribes.subscribes)(appTopics)(AppContainer);

          if (this.props.connectionStatus !== _constants.CONNECTION_STATUS.LOADED) {
            return _react.default.createElement("div", {
              className: "simpl simpl-".concat(this.props.connectionStatus)
            }, _react.default.createElement(this.props.progressComponent, _extends({}, this.props, this.state)));
          }

          return _react.default.createElement("div", {
            className: "simpl simpl-".concat(this.props.connectionStatus)
          }, _react.default.createElement(SubscribedAppContainer, _extends({}, this.props, this.state)));
        }
      }]);

      return Simpl;
    }(_react.default.Component);

    Simpl.propTypes = {
      topics: _propTypes.default.array.isRequired,
      connectionStatus: _propTypes.default.string.isRequired,
      onLeave: _propTypes.default.func,
      onReady: _propTypes.default.func.isRequired,
      progressComponent: _propTypes.default.func.isRequired,
      setConnectionStatus: _propTypes.default.func.isRequired
    };
    var SimplContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(Simpl);
    return SimplContainer;
  };
}
/**
 * @namespace simpl
 * @memberof Simpl.decorators
 */


var _default = simpl;
exports.default = _default;