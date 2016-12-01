
import React from 'react';
import { FormControl, FormGroup, HelpBlock, InputGroup } from 'react-bootstrap';

import { validateField } from '../../decorators/forms/validates';
import { inputPropTypes } from './props';
import { min, max } from './validators';


function Input(props) {
  const errors = props.messages.map((msg) => <HelpBlock key={msg}>{msg}</HelpBlock>);

  return (
    <FormGroup
      validationState={props.validationState}
    >
      <InputGroup>
        <FormControl
          {...props}
        />
      </InputGroup>
      {errors}
    </FormGroup>
  );
}

Input.defaultProps = {
  type: 'number',
};

Input.propTypes = Object.assign({}, inputPropTypes, {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
});

/**
 * A component to validate a number.

 * Default validation options:
 *  * `errors`: [{@link min}, {@link max}],
 *  * `sanitizers`: `['toFloat']`
 *
 * Default props: `{type: 'number'}`
 * @namespace NumberInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
export const NumberInput = validateField({
  errors: [min, max],
  sanitizers: ['toFloat'],
})(Input);

export default NumberInput;
