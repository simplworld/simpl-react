'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.wamp = wamp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _simpl = require('../actions/simpl');

var _constants = require('../constants');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @function
 * @memberof Simpl.decorators
 */
function wamp() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (Component) {
    var optionsWithDefaults = (0, _utils.wampOptionsWithDefaults)(options);

    var Wamp = function (_React$Component) {
      _inherits(Wamp, _React$Component);

      function Wamp() {
        _classCallCheck(this, Wamp);

        return _possibleConstructorReturn(this, (Wamp.__proto__ || Object.getPrototypeOf(Wamp)).apply(this, arguments));
      }

      _createClass(Wamp, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          (0, _utils.wampSetup)(this, optionsWithDefaults);
        }
      }, {
        key: 'render',
        value: function render() {
          if (this.props.connectionStatus === _constants.CONNECTION_STATUS.CONNECTING) {
            return _react2.default.createElement(
              'div',
              { className: 'wamp wamp-' + this.props.connectionStatus },
              _react2.default.createElement(optionsWithDefaults.progressComponent, this.props)
            );
          }
          return _react2.default.createElement(
            'div',
            { className: 'wamp wamp-' + this.props.connectionStatus },
            _react2.default.createElement(Component, this.props)
          );
        }
      }]);

      return Wamp;
    }(_react2.default.Component);

    Wamp.propTypes = {
      onReady: _react2.default.PropTypes.func,
      connectionStatus: _react2.default.PropTypes.string.isRequired,
      setConnectionStatus: _react2.default.PropTypes.func.isRequired
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

exports.default = wamp;