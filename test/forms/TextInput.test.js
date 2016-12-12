import React from 'react';
import { mount } from 'enzyme';
import { reduxFormPropTypes } from '../../src/components/forms/props';
import TextInput from '../../src/components/forms/TextInput.react';
import { Provider } from 'react-redux';

import store from '../../src/test/store';

import { reduxForm, Field } from 'redux-form';


function MyForm(props) {
  const { submitting, invalid } = props;

  return (
    <form>
      <Field
        name="text"
        component={TextInput}
        initialValue={props.initialValue}
        required
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


describe('TextInput', () => {
  it('validates', () => {
    const { enzymeWrapper } = setup();
    const input = enzymeWrapper.find('input');
    input.node.value = '';

    // Validation does not happen on change, but on blur
    input.simulate('change');
    // make sure the value is still there
    expect(input.node.value).toEqual('');
    // no error until we blur
    expect(enzymeWrapper.find('.help-block').length).toEqual(0);
    // submit button is still enabled
    expect(enzymeWrapper.find('button[type="submit"]').prop('disabled')).toEqual(false);

    input.simulate('blur');
    expect(input.node.value).toEqual('');
    expect(enzymeWrapper.find('.help-block').length).toEqual(1);

    // errors should disappear on focus
    input.simulate('focus');
    expect(enzymeWrapper.find('.help-block').length).toEqual(0);

    // Submitting button should now be disabled
    expect(enzymeWrapper.find('button[type="submit"]').prop('disabled')).toEqual(true);
  });
});
