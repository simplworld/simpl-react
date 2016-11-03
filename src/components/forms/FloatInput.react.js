import React from 'react';
import { FormControl, FormGroup, HelpBlock, InputGroup } from 'react-bootstrap';

import { validateField } from '../../decorators/forms/validates';
import { getNumberProps, inputPropTypes } from './props';
import { min, max } from './validators';


function Input(props) {
  const inputProps = getNumberProps(props);
  const errors = props.messages.map((msg) => <HelpBlock key={msg}>{msg}</HelpBlock>);

  return (
    <FormGroup
      validationState={props.validationState}
    >
      <InputGroup>
        <FormControl
          {...inputProps}
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

export const FloatInput = validateField({
  errors: [min, max, 'isFloat'],
  sanitizers: ['toFloat'],
})(Input);

export default FloatInput;
