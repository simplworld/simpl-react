"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.publishes = publishes;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash"));

var _autobahn = _interopRequireDefault(require("../../autobahn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
 * @function publishes
 * @memberof Simpl.decorators.pubsub
 */
function publishes(topic) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (Component) {
    var defaults = {
      acknowledge: true,
      disclose_me: true,
      exclude_me: false
    };

    var optionsWithDefaults = _extends(defaults, {}, options);

    var Publisher =
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(Publisher, _React$Component);

      function Publisher(props) {
        var _this;

        _classCallCheck(this, Publisher);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Publisher).call(this, props));
        _this.publish = _this.publish.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        return _this;
      }

      _createClass(Publisher, [{
        key: "publish",
        value: function publish(payload) {
          var _this2 = this;

          var args = payload.args || [];
          var kwargs = payload.kwargs || {};
          var resolvedTopic = topic;

          if (_lodash.default.isFunction(topic)) {
            resolvedTopic = topic.bind(this)(this.props);
          }

          return _autobahn.default.publish(resolvedTopic, args, kwargs, optionsWithDefaults).then(function (publication) {
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
        key: "render",
        value: function render() {
          return _react.default.createElement(Component, _extends({}, this.props, this.state, {
            publish: this.publish
          }));
        }
      }]);

      return Publisher;
    }(_react.default.Component);

    Publisher.propTypes = {
      onPublished: _propTypes.default.func,
      onPublishedError: _propTypes.default.func
    };
    return Publisher;
  };
}

var _default = publishes;
exports.default = _default;