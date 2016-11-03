import React from 'react';
import { FormControl, FormGroup, HelpBlock, InputGroup } from 'react-bootstrap';

import { validateField } from '../../decorators/forms/validates';
import { inputPropTypes } from './props';
import { min, max } from './validators';
import { decimalPlaces } from './formatters';


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
  type: 'number',
  decimalPlaces: 2,
};

Input.propTypes = Object.assign({}, inputPropTypes, {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  decimalPlaces: React.PropTypes.number,
});

export const DecimalInput = validateField({
  errors: [min, max, 'isDecimal'],
  sanitizers: ['toFloat'],
  formatters: [decimalPlaces],
})(Input);

export default DecimalInput;
