"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wamp = wamp;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _simpl = require("../actions/simpl");

var _constants = require("../constants");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @function
 * @memberof Simpl.decorators
 */
function wamp() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (Component) {
    var optionsWithDefaults = (0, _utils.wampOptionsWithDefaults)(options);

    var Wamp =
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(Wamp, _React$Component);

      function Wamp() {
        _classCallCheck(this, Wamp);

        return _possibleConstructorReturn(this, _getPrototypeOf(Wamp).apply(this, arguments));
      }

      _createClass(Wamp, [{
        key: "componentWillMount",
        value: function componentWillMount() {
          (0, _utils.wampSetup)(this, optionsWithDefaults);
        }
      }, {
        key: "render",
        value: function render() {
          if (this.props.connectionStatus === _constants.CONNECTION_STATUS.CONNECTING) {
            return _react.default.createElement("div", {
              className: "wamp wamp-".concat(this.props.connectionStatus)
            }, _react.default.createElement(optionsWithDefaults.progressComponent, this.props));
          }

          return _react.default.createElement("div", {
            className: "wamp wamp-".concat(this.props.connectionStatus)
          }, _react.default.createElement(Component, this.props));
        }
      }]);

      return Wamp;
    }(_react.default.Component);

    Wamp.propTypes = {
      onReady: _propTypes.default.func,
      connectionStatus: _propTypes.default.string.isRequired,
      setConnectionStatus: _propTypes.default.func.isRequired
    };

    var mapStateToProps = function mapStateToProps(state) {
      return {
        connectionStatus: state.simpl.connectionStatus
      };
    };

    var mapDispatchToProps = function mapDispatchToProps(dispatch) {
      return {
        setConnectionStatus: function setConnectionStatus(status) {
          dispatch((0, _simpl.setConnectionStatus)(status));
        }
      };
    };

    return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Wamp);
  };
}

var _default = wamp;
exports.default = _default;