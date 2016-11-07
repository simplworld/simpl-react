/**
 * @namespace CurrencyInput
 * @memberof Simpl.components.forms
 */
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
        <InputGroup.Addon>{props.currency}</InputGroup.Addon>
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
  currency: '$',
};

Input.propTypes = Object.assign({}, inputPropTypes, {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  decimalPlaces: React.PropTypes.number,
  currency: React.PropTypes.string,
});

/**
 * A component that allows entering a decimal value and always shows it with fixed
 * precision, prefixed by a currency symbol.

 * Default validation options:
 *  * `errors`: ['isCurrency', {@link min}, {@link max}],
 *  * `sanitizers`: `['toFloat']`
 *  * `formatters`: [{@link decimalPlaces}]
 *
 * Default props: `{type: 'number', decimalPlaces: 2, currency: '$'}`
 * @namespace CurrencyInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
export const CurrencyInput = validateField({
  errors: ['isCurrency', min, max],
  sanitizers: ['toFloat'],
  formatters: [decimalPlaces],
})(Input);

export default CurrencyInput;