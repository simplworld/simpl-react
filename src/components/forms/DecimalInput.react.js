import React from 'react';
import PropTypes from 'prop-types';

import { FormControl, FormGroup, HelpBlock, InputGroup } from 'react-bootstrap';

import { validateField } from '../../decorators/forms/validates';
import { inputPropTypes, getInputProps } from './props';
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
          {...getInputProps(props)}
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
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  decimalPlaces: PropTypes.number,
});


/**
 * A component that allows entering a decimal value and always shows it with fixed
 * precision.

 * Default validation options:
 *  * `errors`: ['isDecimal', {@link min}, {@link max}],
 *  * `sanitizers`: `['toFloat']`
 *  * `formatters`: [{@link decimalPlaces}]
 *
 * Default props: `{type: 'number', decimalPlaces: 2}`
 * @namespace DecimalInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
export const DecimalInput = validateField({
  errors: ['isDecimal', min, max],
  sanitizers: ['toFloat'],
  formatters: [decimalPlaces],
})(Input);

export default DecimalInput;
