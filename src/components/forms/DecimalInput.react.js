import React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { validateField } from '../../decorators/forms/validates';

import { getNumberProps, inputPropTypes } from './props';
import { min, max } from './validators';
import { decimalPlaces } from './formatters';


function Input(props) {
  const inputProps = getNumberProps(props);
  return (
    <InputGroup>
      <FormControl
        {...inputProps}
      />
    </InputGroup>
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
