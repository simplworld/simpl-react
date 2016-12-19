'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.registers = registers;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobahn = require('../../autobahn');

var _autobahn2 = _interopRequireDefault(_autobahn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @function
 * @memberof Simpl.decorators.rpc
 */
function registers(Component, procedure) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return function (Component) {
    var defaults = { match: 'prefix' };
    var optionsWithDefaults = _extends(defaults, {}, options);

    var Listener = function (_React$Component) {
      _inherits(Listener, _React$Component);

      function Listener() {
        _classCallCheck(this, Listener);

        return _possibleConstructorReturn(this, (Listener.__proto__ || Object.getPrototypeOf(Listener)).apply(this, arguments));
      }

      _createClass(Listener, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          this.registrations = [];

          // eslint-disable-next-line no-unused-vars
          _autobahn2.default.Connection.onReady(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                session = _ref2[0],
                details = _ref2[1];

            _this2.register(session);
          });
          // eslint-disable-next-line no-unused-vars
          _autobahn2.default.Connection.onLost(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                session = _ref4[0],
                details = _ref4[1];

            _this2.register(_autobahn2.default);
          });
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.unregister();
        }
      }, {
        key: 'register',
        value: function register(session) {
          var _this3 = this;

          var handler = this.props.onCalled.bind(this);
          session.register(procedure, handler, optionsWithDefaults).then(function (registration) {
            _this3.registrations.push(registration);
            console.log("registered procedure " + procedure);
          });
        }
      }, {
        key: 'unregister',
        value: function unregister() {
          this.registrations.forEach(function (registration) {
            _autobahn2.default.unregister(registration);
          });
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(Component, _extends({}, this.props, this.state));
        }
      }]);

      return Listener;
    }(_react2.default.Component);

    Listener.propTypes = {
      append: _react2.default.PropTypes.bool,
      options: _react2.default.PropTypes.object,
      onCalled: _react2.default.PropTypes.func
    };

    return Listener;
  };
}

exports.default = registers;