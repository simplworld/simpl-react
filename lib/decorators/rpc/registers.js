"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registers = registers;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _autobahn = _interopRequireDefault(require("../../autobahn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * @function
 * @memberof Simpl.decorators.rpc
 */
function registers(Component, procedure) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (Component) {
    var defaults = {
      match: 'prefix'
    };

    var optionsWithDefaults = _extends(defaults, {}, options);

    var Listener =
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(Listener, _React$Component);

      function Listener() {
        _classCallCheck(this, Listener);

        return _possibleConstructorReturn(this, _getPrototypeOf(Listener).apply(this, arguments));
      }

      _createClass(Listener, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this = this;

          this.registrations = []; // eslint-disable-next-line no-unused-vars

          _autobahn.default.Connection.onReady(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                session = _ref2[0],
                details = _ref2[1];

            _this.register(session);
          }); // eslint-disable-next-line no-unused-vars


          _autobahn.default.Connection.onLost(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                session = _ref4[0],
                details = _ref4[1];

            _this.register(_autobahn.default);
          });
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.unregister();
        }
      }, {
        key: "register",
        value: function register(session) {
          var _this2 = this;

          var handler = this.props.onCalled.bind(this);
          session.register(procedure, handler, optionsWithDefaults).then(function (registration) {
            _this2.registrations.push(registration);

            console.log("registered procedure " + procedure);
          });
        }
      }, {
        key: "unregister",
        value: function unregister() {
          this.registrations.forEach(function (registration) {
            _autobahn.default.unregister(registration);
          });
        }
      }, {
        key: "render",
        value: function render() {
          return _react.default.createElement(Component, _extends({}, this.props, this.state));
        }
      }]);

      return Listener;
    }(_react.default.Component);

    Listener.propTypes = {
      append: _propTypes.default.bool,
      options: _propTypes.default.object,
      onCalled: _propTypes.default.func
    };
    return Listener;
  };
}

var _default = registers;
exports.default = _default;