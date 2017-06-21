'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FloatInput = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactBootstrap = require('react-bootstrap');

var _validates = require('../../decorators/forms/validates');

var _props = require('./props');

var _validators = require('./validators');

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
      _react2.default.createElement(_reactBootstrap.FormControl, (0, _props.getInputProps)(props))
    ),
    errors
  );
}

Input.defaultProps = {
  type: 'number',
  step: 0.1
};

Input.propTypes = _extends({}, _props.inputPropTypes, {
  min: _propTypes2.default.number,
  max: _propTypes2.default.number,
  step: _propTypes2.default.number,
  decimalPlaces: _propTypes2.default.number
});

/**
 * A component that allows entering a float number.

 * Default validation options:
 *  * `errors`: ['isFloat', {@link min}, {@link max}],
 *  * `sanitizers`: `['toFloat']`
 *
 * Default props: `{type: 'number', step: 0.1}`
 * @namespace FloatInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
var FloatInput = exports.FloatInput = (0, _validates.validateField)({
  errors: ['isFloat', _validators.min, _validators.max],
  sanitizers: ['toFloat']
})(Input);

exports.default = FloatInput;