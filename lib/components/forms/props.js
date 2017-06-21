'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduxFormPropTypes = exports.inputPropTypes = undefined;
exports.getInputProps = getInputProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inputPropTypes = exports.inputPropTypes = {
  errors: _propTypes2.default.array,
  warning: _propTypes2.default.array,
  sanitizers: _propTypes2.default.array,
  formatters: _propTypes2.default.array,
  messages: _propTypes2.default.array,
  validationState: _propTypes2.default.string,

  id: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  onBlur: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  readOnly: _propTypes2.default.bool,
  required: _propTypes2.default.bool,
  type: _propTypes2.default.string,
  value: _propTypes2.default.any,

  disabled: _propTypes2.default.bool,
  maxLength: _propTypes2.default.number,
  placeholder: _propTypes2.default.string
};

var reduxFormPropTypes = exports.reduxFormPropTypes = {
  error: _propTypes2.default.any,
  handleSubmit: _propTypes2.default.func,
  input: _propTypes2.default.object,
  label: _propTypes2.default.string,
  meta: _propTypes2.default.object,
  pristine: _propTypes2.default.bool,
  reset: _propTypes2.default.func,
  submitting: _propTypes2.default.bool,
  type: _propTypes2.default.string
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