import React from 'react';


export const inputPropTypes = {
  inputProps: React.PropTypes.shape({
    type: React.PropTypes.string,
    value: React.PropTypes.any,
    name: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    required: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    readOnly: React.PropTypes.bool,
    maxLength: React.PropTypes.number,
  }),
  errors: React.PropTypes.array,
  warning: React.PropTypes.array,
  sanitizers: React.PropTypes.array,
  formatters: React.PropTypes.array,
  messages: React.PropTypes.array,
  validationState: React.PropTypes.string,
};


export const reduxFormPropTypes = {
  input: React.PropTypes.object,
  label: React.PropTypes.string,
  type: React.PropTypes.string,
  meta: React.PropTypes.object,
  error: React.PropTypes.any,
  pristine: React.PropTypes.bool,
  reset: React.PropTypes.func,
  submitting: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func,
};
