'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.publishes = publishes;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _autobahn = require('../../autobahn');

var _autobahn2 = _interopRequireDefault(_autobahn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @function publishes
 * @memberof Simpl.decorators.pubsub
 */
function publishes(Component, topic) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var defaults = { acknowledge: true, disclose_me: true, exclude_me: false };
  var optionsWithDefaults = _extends(defaults, {}, options);

  var Publisher = function (_React$Component) {
    _inherits(Publisher, _React$Component);

    function Publisher(props) {
      _classCallCheck(this, Publisher);

      var _this = _possibleConstructorReturn(this, (Publisher.__proto__ || Object.getPrototypeOf(Publisher)).call(this, props));

      _this.publish = _this.publish.bind(_this);
      return _this;
    }

    _createClass(Publisher, [{
      key: 'publish',
      value: function publish(payload) {
        var _this2 = this;

        var args = payload.args || [];
        var kwargs = payload.kwargs || {};
        var resolvedTopic = topic;

        if (_lodash2.default.isFunction(topic)) {
          resolvedTopic = topic.bind(this)(this.props);
        }
        return _autobahn2.default.publish(resolvedTopic, args, kwargs, optionsWithDefaults).then(function (publication) {
          if (_this2.props.onPublished) {
            return _this2.props.onPublished(resolvedTopic, args, kwargs, optionsWithDefaults, publication);
          }
          return publication;
        }).catch(function (error) {
          if (_this2.props.onPublishedError) {
            return _this2.props.onPublishedError(resolvedTopic, args, kwargs, optionsWithDefaults, error);
          }
          return error;
        });
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Component, _extends({}, this.props, this.state, { publish: this.publish }));
      }
    }]);

    return Publisher;
  }(_react2.default.Component);

  Publisher.propTypes = {
    onPublished: _react2.default.PropTypes.func,
    onPublishedError: _react2.default.PropTypes.func
  };

  return Publisher;
}

exports.default = publishes;