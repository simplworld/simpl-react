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
          {...props}
          type="password"
        />
      </InputGroup>
      {errors}
    </FormGroup>
  );
}

Input.propTypes = inputPropTypes;

/**
 * A component for entering a password. The `type` props is hardcoded to `'password'`.
 *
 * @namespace PasswordInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
export const PasswordInput = validateField({
})(Input);

export default PasswordInput;
