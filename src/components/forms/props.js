import React from 'react';
import PropTypes from 'prop-types';

export const inputPropTypes = {
  errors: PropTypes.array,
  warning: PropTypes.array,
  sanitizers: PropTypes.array,
  formatters: PropTypes.array,
  messages: PropTypes.array,
  validationState: PropTypes.string,

  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.any,

  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
};


export const reduxFormPropTypes = {
  error: PropTypes.any,
  handleSubmit: PropTypes.func,
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  pristine: PropTypes.bool,
  reset: PropTypes.func,
  submitting: PropTypes.bool,
  type: PropTypes.string,
};


export function getInputProps(props) {
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
    step: props.step,
  };
}
