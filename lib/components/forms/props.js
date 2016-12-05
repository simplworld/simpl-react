'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduxFormPropTypes = exports.inputPropTypes = undefined;
exports.getInputProps = getInputProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inputPropTypes = exports.inputPropTypes = {
  inputProps: _react2.default.PropTypes.shape({
    type: _react2.default.PropTypes.string,
    value: _react2.default.PropTypes.any,
    name: _react2.default.PropTypes.string.isRequired,
    onChange: _react2.default.PropTypes.func,
    onBlur: _react2.default.PropTypes.func,
    onFocus: _react2.default.PropTypes.func,
    placeholder: _react2.default.PropTypes.string,
    required: _react2.default.PropTypes.bool,
    disabled: _react2.default.PropTypes.bool,
    readOnly: _react2.default.PropTypes.bool,
    maxLength: _react2.default.PropTypes.number
  }),
  errors: _react2.default.PropTypes.array,
  warning: _react2.default.PropTypes.array,
  sanitizers: _react2.default.PropTypes.array,
  formatters: _react2.default.PropTypes.array,
  messages: _react2.default.PropTypes.array,
  validationState: _react2.default.PropTypes.string
};

var reduxFormPropTypes = exports.reduxFormPropTypes = {
  input: _react2.default.PropTypes.object,
  label: _react2.default.PropTypes.string,
  type: _react2.default.PropTypes.string,
  meta: _react2.default.PropTypes.object,
  error: _react2.default.PropTypes.any,
  pristine: _react2.default.PropTypes.bool,
  reset: _react2.default.PropTypes.func,
  submitting: _react2.default.PropTypes.bool,
  handleSubmit: _react2.default.PropTypes.func
};

function getInputProps(props) {
  return {
    value: props.value,
    type: props.type,
    min: props.min,
    max: props.max,
    step: props.step,
    readOnly: props.readOnly,
    required: props.required,
    onBlur: props.onBlur,
    onChange: props.onChange,
    onFocus: props.onFocus
  };
}