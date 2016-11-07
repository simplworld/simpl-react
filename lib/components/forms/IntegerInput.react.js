'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IntegerInput = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
      _react2.default.createElement(_reactBootstrap.FormControl, props.inputProps)
    ),
    errors
  );
}

Input.defaultProps = {
  type: 'number'
};

Input.propTypes = _extends({}, _props.inputPropTypes, {
  min: _react2.default.PropTypes.number,
  max: _react2.default.PropTypes.number,
  step: _react2.default.PropTypes.number
});

/**
 * A component that allows entering an integer number.

 * Default validation options:
 *  * `errors`: ['isInt', {@link min}, {@link max}],
 *  * `sanitizers`: `['toInt']`
 *
 * Default props: `{type: 'number'}`
 * @namespace IntegerInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
var IntegerInput = exports.IntegerInput = (0, _validates.validateField)({
  errors: ['isInt', _validators.min, _validators.max],
  sanitizers: ['toInt']
})(Input);

exports.default = IntegerInput;