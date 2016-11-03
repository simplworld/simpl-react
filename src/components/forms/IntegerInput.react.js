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
        {...inputProps}
      />
    </InputGroup>
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

export const IntegerInput = validateField({
  errors: ['isInt', min, max],
  sanitizers: ['toInt'],
})(Input);


export default IntegerInput;
