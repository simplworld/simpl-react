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
        <InputGroup.Addon>@</InputGroup.Addon>
        <FormControl
          {...props}
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


/**
 * A component that allows entering and eamil address.

 * Default validation options:
 *  * `errors`: `['isEmail']`,
 *  * `sanitizers`: `['normalizeEmail']`
 *
 * Default props: `{type: 'email'}`
 * @namespace EmailInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
export const EmailInput = validateField({
  errors: ['isEmail'],
  sanitizers: ['normalizeEmail'],
})(Input);


export default EmailInput;
