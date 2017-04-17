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
  errors: _react2.default.PropTypes.array,
  warning: _react2.default.PropTypes.array,
  sanitizers: _react2.default.PropTypes.array,
  formatters: _react2.default.PropTypes.array,
  messages: _react2.default.PropTypes.array,
  validationState: _react2.default.PropTypes.string,

  id: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  onBlur: _react2.default.PropTypes.func,
  onChange: _react2.default.PropTypes.func,
  onFocus: _react2.default.PropTypes.func,
  readOnly: _react2.default.PropTypes.bool,
  required: _react2.default.PropTypes.bool,
  type: _react2.default.PropTypes.string,
  value: _react2.default.PropTypes.any,

  disabled: _react2.default.PropTypes.bool,
  maxLength: _react2.default.PropTypes.number,
  placeholder: _react2.default.PropTypes.string
};

var reduxFormPropTypes = exports.reduxFormPropTypes = {
  error: _react2.default.PropTypes.any,
  handleSubmit: _react2.default.PropTypes.func,
  input: _react2.default.PropTypes.object,
  label: _react2.default.PropTypes.string,
  meta: _react2.default.PropTypes.object,
  pristine: _react2.default.PropTypes.bool,
  reset: _react2.default.PropTypes.func,
  submitting: _react2.default.PropTypes.bool,
  type: _react2.default.PropTypes.string
};

function getInputProps(props) {
  return {
    id: props.id,
    name: props.name,
    onBlur: props.onBlur,
    onChange: props.onChange,
    onFocus: props.onFocus,
    readOnly: props.readOnly,
    required: props.required,
    type: props.type,
    value: props.value,

    max: props.min,
    min: props.max,
    step: props.step
  };
}