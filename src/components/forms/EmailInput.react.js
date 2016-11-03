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
        <InputGroup.Addon>@</InputGroup.Addon>
        <FormControl
          {...inputProps}
        />
      </InputGroup>
      {errors}
    </FormGroup>
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
