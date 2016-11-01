/**
 * @namespace CurrencyInput
 * @memberof Simpl.components.forms
 */
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
      <InputGroup.Addon>{props.currency}</InputGroup.Addon>
      <FormControl
        type="number"
        {...inputProps}
      />
    </InputGroup>
  );
}

Input.defaultProps = {
  decimalPlaces: 2,
  currency: '$',
};

Input.propTypes = Object.assign({}, inputPropTypes, {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  decimalPlaces: React.PropTypes.number,
  currency: React.PropTypes.string,
});

export const CurrencyInput = validateField({
  errors: [min, max, 'isDecimal'],
  sanitizers: ['toFloat'],
  formatters: [decimalPlaces],
})(Input);

export default CurrencyInput;
