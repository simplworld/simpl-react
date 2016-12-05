import React from 'react';
import { FormControl, FormGroup, HelpBlock, InputGroup } from 'react-bootstrap';

import { validateField } from '../../decorators/forms/validates';
import { inputPropTypes, getInputProps } from './props';
import { min, max } from './validators';


function Input(props) {
  const errors = props.messages.map((msg) => <HelpBlock key={msg}>{msg}</HelpBlock>);

  return (
    <FormGroup
      validationState={props.validationState}
    >
      <InputGroup>
        <FormControl
          {...getInputProps(props)}
        />
      </InputGroup>
      {errors}
    </FormGroup>
  );
}

Input.defaultProps = {
  type: 'number',
  step: 0.1,
};

Input.propTypes = Object.assign({}, inputPropTypes, {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  decimalPlaces: React.PropTypes.number,
});

/**
 * A component that allows entering a float number.

 * Default validation options:
 *  * `errors`: ['isFloat', {@link min}, {@link max}],
 *  * `sanitizers`: `['toFloat']`
 *
 * Default props: `{type: 'number', step: 0.1}`
 * @namespace FloatInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
export const FloatInput = validateField({
  errors: ['isFloat', min, max],
  sanitizers: ['toFloat'],
})(Input);

export default FloatInput;
