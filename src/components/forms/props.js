import React from 'react';


export const inputPropTypes = {
  errors: React.PropTypes.array,
  warning: React.PropTypes.array,
  sanitizers: React.PropTypes.array,
  formatters: React.PropTypes.array,
  messages: React.PropTypes.array,
  validationState: React.PropTypes.string,

  id: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  onBlur: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  readOnly: React.PropTypes.bool,
  required: React.PropTypes.bool,
  type: React.PropTypes.string,
  value: React.PropTypes.any,

  disabled: React.PropTypes.bool,
  maxLength: React.PropTypes.number,
  placeholder: React.PropTypes.string,
};


export const reduxFormPropTypes = {
  error: React.PropTypes.any,
  handleSubmit: React.PropTypes.func,
  input: React.PropTypes.object,
  label: React.PropTypes.string,
  meta: React.PropTypes.object,
  pristine: React.PropTypes.bool,
  reset: React.PropTypes.func,
  submitting: React.PropTypes.bool,
  type: React.PropTypes.string,
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
