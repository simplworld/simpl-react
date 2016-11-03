import React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { validateField } from '../../decorators/forms/validates';

import { getInputProps, inputPropTypes } from './props';


function Input(props) {
  const inputProps = getInputProps(props);
  return (
    <InputGroup>
      <InputGroup.Addon>@</InputGroup.Addon>
      <FormControl
        {...inputProps}
      />
    </InputGroup>
  );
}

Input.defaultProps = {
  type: 'email',
};

Input.propTypes = inputPropTypes;

export const EmailInput = validateField({
  errors: ['isEmail'],
  sanitizers: ['normalizeEmail'],
})(Input);


export default EmailInput;
