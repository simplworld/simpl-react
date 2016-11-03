import React from 'react';
import { FormControl, FormGroup, HelpBlock, InputGroup } from 'react-bootstrap';

import { validateField } from '../../decorators/forms/validates';
import { inputPropTypes } from './props';


function Input(props) {
  const errors = props.messages.map((msg) => <HelpBlock key={msg}>{msg}</HelpBlock>);

  return (
    <FormGroup
      validationState={props.validationState}
    >
      <InputGroup>
        <FormControl
          {...props.inputProps}
        />
      </InputGroup>
      {errors}
    </FormGroup>
  );
}

Input.defaultProps = {
  type: 'text',
};

Input.propTypes = inputPropTypes;

export const TextInput = validateField({
  sanitizers: ['trim'],
})(Input);

export default TextInput;
