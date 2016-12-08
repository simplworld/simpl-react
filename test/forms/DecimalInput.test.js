import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { reduxFormPropTypes } from '../../src/components/forms/props';
import DecimalInput from '../../src/components/forms/DecimalInput.react';
import { Provider, connect } from 'react-redux';

import store from '../store';

import { reduxForm, Field } from 'redux-form';


function MyForm(props) {
  const { error, submitting, invalid } = props;

  return (
    <form>
      <Field
        name="decimal"
        component={DecimalInput}
        initialValue={props.initialValue}
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
  };

  const enzymeWrapper = mount(<Provider store={store}><ValidatingForm {...props} /></Provider>);

  return {
    props,
    enzymeWrapper,
  };
}


describe('DecimalInput', () => {
  it('format correctly', () => {
    const { enzymeWrapper } = setup();
    const input = enzymeWrapper.find('input');

    expect(input.prop('value')).toEqual('2.00');

    input.node.value = '5';

    // Formatting does not happen on change, but on blur
    input.simulate('change');
    // make sure the original value is still there
    expect(input.node.value).toEqual('5');

    input.simulate('blur');
    // value is now formatted
    expect(input.node.value).toEqual('5.00');
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

    // Submitting button should now be disabled
    expect(enzymeWrapper.find('button[type="submit"]').prop('disabled')).toEqual(true);
  });
});
