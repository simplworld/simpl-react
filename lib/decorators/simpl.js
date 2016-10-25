'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.simpl = simpl;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _simpl = require('../actions/simpl');

var _subscribes = require('./pubsub/subscribes');

var _wamp = require('./wamp');

var _wamp2 = _interopRequireDefault(_wamp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _autobahnReact = require('autobahn-react');

var _autobahnReact2 = _interopRequireDefault(_autobahnReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @function
 * @memberof Simpl.decorators
 */
function simpl(Component) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var optionsWithDefaults = _extends({}, options, {});
  if (_lodash2.default.isFunction(options.topics)) {
    optionsWithDefaults.topics = options.topics();
  }

  var mapStateToProps = function mapStateToProps(state) {
    return {
      simplLoaded: state.simpl.loaded
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
      }
    };
  };

  var appMapDispatchToProps = function appMapDispatchToProps(dispatch) {
    return {
      // eslint-disable-next-line camelcase
      onReceived: function onReceived(_ref, kwargs, event) {
        var _ref2 = _slicedToArray(_ref, 3);

        var pk = _ref2[0];
        var resource_name = _ref2[1];
        var data = _ref2[2];

        var resolvedTopics = optionsWithDefaults.topics.map(function (topic) {
          return _autobahnReact2.default.Connection.currentConnection.session.resolve(topic);
        });
        resolvedTopics.forEach(function (topic) {
          var _actions;

          var actions = (_actions = {}, _defineProperty(_actions, topic + '.add_child', _simpl.addChild), _defineProperty(_actions, topic + '.remove_child', _simpl.removeChild), _defineProperty(_actions, topic + '.update_child', _simpl.updateScope), _actions);
          if (actions[event.topic]) {
            dispatch(actions[event.topic]({ resource_name: resource_name, data: data, pk: pk }));
          }
        });
      }
    };
  };

  var AppContainer = _react2.default.createClass({
    displayName: 'AppContainer',

    propTypes: {
      simplLoaded: _react2.default.PropTypes.bool
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
      if (this.props.simplLoaded) {
        return false;
      }
      return this.props !== nextProps || this.state !== nextState;
    },
    render: function render() {
      return _react2.default.createElement(Component, _extends({}, this.props, this.state));
    }
  });

  var appTopics = optionsWithDefaults.topics.reduce(function (memo, topic) {
    return memo.concat([topic + '.add_child', topic + '.update_child', topic + '.remove_child']);
  }, []);
  var SubscribedAppContainer = (0, _reactRedux.connect)(null, appMapDispatchToProps)((0, _subscribes.subscribes)(AppContainer, appTopics));

  var Simpl = _react2.default.createClass({
    displayName: 'Simpl',

    propTypes: {
      simplLoaded: _react2.default.PropTypes.bool,
      onLeave: _react2.default.PropTypes.func,
      onReady: _react2.default.PropTypes.func.isRequired
    },
    componentWillMount: function componentWillMount() {
      this.props.onReady();
      window.addEventListener('beforeunload', this.props.onLeave);
    },
    componentWillUnmount: function componentWillUnmount() {
      window.removeEventListener('beforeunload', this.props.onLeave);
    },
    render: function render() {
      if (!this.props.simplLoaded) {
        return _react2.default.createElement(
          'div',
          null,
          'Loading data...'
        );
      }
      return _react2.default.createElement(SubscribedAppContainer, _extends({}, this.props, this.state));
    }
  });

  var SimplContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Simpl);
  var WampContainer = (0, _wamp2.default)(SimplContainer, optionsWithDefaults);

  return WampContainer;
}

/**
 * @namespace simpl
 * @memberof Simpl.decorators
 */
exports.default = simpl;