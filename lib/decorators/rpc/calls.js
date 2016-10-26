'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.calls = calls;

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
function calls(Component, procedure) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var defaults = {};
  var optionsWithDefaults = _extends(defaults, {}, options);

  var Caller = function (_React$Component) {
    _inherits(Caller, _React$Component);

    function Caller(props) {
      _classCallCheck(this, Caller);

      var _this = _possibleConstructorReturn(this, (Caller.__proto__ || Object.getPrototypeOf(Caller)).call(this, props));

      _this.call = _this.call.bind(_this);
      return _this;
    }

    _createClass(Caller, [{
      key: 'call',
      value: function call(payload) {
        var args = payload.args || [];
        var kwargs = payload.kwargs || {};
        return _autobahn2.default.call(procedure, args, kwargs, optionsWithDefaults);
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Component, _extends({}, this.props, this.state, { call: this.call }));
      }
    }]);

    return Caller;
  }(_react2.default.Component);

  return Caller;
}

exports.default = calls;