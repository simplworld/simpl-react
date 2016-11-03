import React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { validateField } from '../../decorators/forms/validates';

import { getInputProps, inputPropTypes } from './props';


function Input(props) {
  const inputProps = getInputProps(props);
  return (
    <InputGroup>
      <FormControl
        {...inputProps}
        type="password"
      />
    </InputGroup>
  );
}

Input.propTypes = inputPropTypes;

export const PasswordInput = validateField({
})(Input);

export default PasswordInput;
