import React from 'react';
import { mount } from 'enzyme';
import { reduxFormPropTypes } from '../../src/components/forms/props';
import IntegerInput from '../../src/components/forms/IntegerInput.react';
import { Provider } from 'react-redux';

import store from '../store';

import { reduxForm, Field } from 'redux-form';


function MyForm(props) {
  const { submitting, invalid } = props;

  return (
    <form>
      <Field
        name="decimal"
        component={IntegerInput}
        initialValue={props.initialValue}
        min={props.min}
        max={props.max}
      />
      <button
        type="submit"
        disabled={invalid || submitting}
      >
        Submit
      </button>
    </form>
  );
}

MyForm.propTypes = reduxFormPropTypes;

const ValidatingForm = reduxForm({ form: 'myForm' })(MyForm);

function setup() {
  const props = {
    initialValue: 2,
    min: 2,
    max: 5,
  };

  const enzymeWrapper = mount(<Provider store={store}><ValidatingForm {...props} /></Provider>);

  return {
    props,
    enzymeWrapper,
  };
}


describe('IntegerInput', () => {
  it('format correctly', () => {
    const { enzymeWrapper } = setup();
    const input = enzymeWrapper.find('input');

    expect(input.prop('value')).toEqual(2);
  });

  it('validates', () => {
    const { enzymeWrapper } = setup();
    const input = enzymeWrapper.find('input');
    input.node.value = 'not a number';

    // Validation does not happen on change, but on blur
    input.simulate('change');
    // make sure the value is still there
    expect(input.node.value).toEqual('not a number');
    // no error until we blur
    expect(enzymeWrapper.find('.help-block').length).toEqual(0);
    // submit button is still enabled
    expect(enzymeWrapper.find('button[type="submit"]').prop('disabled')).toEqual(false);

    input.simulate('blur');
    expect(input.node.value).toEqual('not a number');
    expect(enzymeWrapper.find('.help-block').length).toEqual(1);

    // errors should disappear on focus
    input.simulate('focus');
    expect(enzymeWrapper.find('.help-block').length).toEqual(0);

    // Submitting button should now be disabled
    expect(enzymeWrapper.find('button[type="submit"]').prop('disabled')).toEqual(true);

    // value can't be smaller than `props.min`
    input.node.value = 1;
    input.simulate('change');
    input.simulate('blur');
    expect(enzymeWrapper.find('.help-block').length).toEqual(1);
  });
});
