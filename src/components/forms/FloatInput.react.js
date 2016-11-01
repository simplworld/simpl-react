import React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { validateField } from '../../decorators/forms/validates';

import { getNumberProps, inputPropTypes } from './props';
import { min, max } from './validators';


function Input(props) {
  const inputProps = getNumberProps(props);
  return (
    <InputGroup>
      <FormControl
        type="number"
        {...inputProps}
      />
    </InputGroup>
  );
}

Input.defaultProps = {
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
