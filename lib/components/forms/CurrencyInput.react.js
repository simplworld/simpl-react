'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CurrencyInput = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * @namespace CurrencyInput
                                                                                                                                                                                                                                                                   * @memberof Simpl.components.forms
                                                                                                                                                                                                                                                                   */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _validates = require('../../decorators/forms/validates');

var _props = require('./props');

var _validators = require('./validators');

var _formatters = require('./formatters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Input(props) {
  var errors = props.messages.map(function (msg) {
    return _react2.default.createElement(
      _reactBootstrap.HelpBlock,
      { key: msg },
      msg
    );
  });

  return _react2.default.createElement(
    _reactBootstrap.FormGroup,
    {
      validationState: props.validationState
    },
    _react2.default.createElement(
      _reactBootstrap.InputGroup,
      null,
      _react2.default.createElement(
        _reactBootstrap.InputGroup.Addon,
        null,
        props.currency
      ),
      _react2.default.createElement(_reactBootstrap.FormControl, props)
    ),
    errors
  );
}

Input.defaultProps = {
  type: 'number',
  decimalPlaces: 2,
  currency: '$'
};

Input.propTypes = _extends({}, _props.inputPropTypes, {
  min: _react2.default.PropTypes.number,
  max: _react2.default.PropTypes.number,
  step: _react2.default.PropTypes.number,
  decimalPlaces: _react2.default.PropTypes.number,
  currency: _react2.default.PropTypes.string
});

/**
 * A component that allows entering a decimal value and always shows it with fixed
 * precision, prefixed by a currency symbol.

 * Default validation options:
 *  * `errors`: ['isCurrency', {@link min}, {@link max}],
 *  * `sanitizers`: `['toFloat']`
 *  * `formatters`: [{@link decimalPlaces}]
 *
 * Default props: `{type: 'number', decimalPlaces: 2, currency: '$'}`
 * @namespace CurrencyInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
var CurrencyInput = exports.CurrencyInput = (0, _validates.validateField)({
  errors: ['isCurrency', _validators.min, _validators.max],
  sanitizers: ['toFloat'],
  formatters: [_formatters.decimalPlaces]
})(Input);

exports.default = CurrencyInput;