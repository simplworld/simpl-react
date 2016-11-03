import React from 'react';
import { FormControl, FormGroup, HelpBlock, InputGroup } from 'react-bootstrap';

import { validateField } from '../../decorators/forms/validates';
import { getInputProps, inputPropTypes } from './props';


function Input(props) {
  const inputProps = getInputProps(props);
  const errors = props.messages.map((msg) => <HelpBlock key={msg}>{msg}</HelpBlock>);

  return (
    <FormGroup
      validationState={props.validationState}
    >
      <InputGroup>
        <FormControl
          {...inputProps}
          type="password"
        />
      </InputGroup>
      {errors}
    </FormGroup>
  );
}

Input.propTypes = inputPropTypes;

export const PasswordInput = validateField({
})(Input);

export default PasswordInput;
