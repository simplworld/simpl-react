import React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { validateField } from '../../decorators/forms/validates';

import { getInputProps, inputPropTypes } from './props';


function Input(props) {
  const inputProps = getInputProps(props);

  return (
    <InputGroup>
      <FormControl
        type="text"
        {...inputProps}
      />
    </InputGroup>
  );
}

Input.propTypes = inputPropTypes;

export const TextInput = validateField({
  sanitizers: ['trim'],
})(Input);

export default TextInput;
