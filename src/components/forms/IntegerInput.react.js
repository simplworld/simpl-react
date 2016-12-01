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
 * A component that allows entering an integer number.

 * Default validation options:
 *  * `errors`: ['isInt', {@link min}, {@link max}],
 *  * `sanitizers`: `['toInt']`
 *
 * Default props: `{type: 'number'}`
 * @namespace IntegerInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
export const IntegerInput = validateField({
  errors: ['isInt', min, max],
  sanitizers: ['toInt'],
})(Input);


export default IntegerInput;
