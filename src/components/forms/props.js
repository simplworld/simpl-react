import React from 'react';


export const inputPropTypes = {
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

  errors: React.PropTypes.array,
  warning: React.PropTypes.array,
  sanitizers: React.PropTypes.array,
  formatters: React.PropTypes.array,
};

export function getInputProps(props) {
  if (props.input) {
    // The component is called form a redux-form Field.
    // Use the `Field` properties, but also remember to call original
    // component's event handlers.
    const overrides = {};
    ['onChange', 'onBlur', 'onFocus'].forEach((method) => {
      if (props[method]) {
        const patched = (...args) => {
          props[method](...args);
          props.input[method](...args);
        };
        overrides[method] = patched;
      }
    });

    return Object.assign({}, props.input, overrides);
  }
  return {
    value: props.value,
    name: props.name,
    onChange: props.onChange,
    onBlur: props.onBlur,
    onFocus: props.onFocus,
    placeholder: props.placeholder,
    required: props.required,
    disabled: props.disabled,
    readOnly: props.readonly,
    maxLength: props.maxlength,
  };
}

export function getNumberProps(props) {
  const inputProps = getInputProps(props);

  return Object.assign({}, inputProps, {
    min: props.min,
    max: props.max,
    step: props.step,
  });
}


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
