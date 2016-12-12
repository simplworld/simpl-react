import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { reduxFormPropTypes } from '../../src/components/forms/props';
import TextInput from '../../src/components/forms/TextInput.react';
import { Provider, connect } from 'react-redux';

import store from '../../src/test/store';

import { reduxForm, Field } from 'redux-form';


function MyForm(props) {
  const { error, submitting, invalid } = props;

  return (
    <form>
      <Field
        name="myInputName"
        component={TextInput}
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
    initialValue: 'some value',
  };

  const enzymeWrapper = render(<Provider store={store}><ValidatingForm {...props} /></Provider>);

  return {
    props,
    enzymeWrapper,
  };
}


describe('Forms', () => {
  it('Pass down `name` prop', () => {
    const { enzymeWrapper } = setup();
    const input = enzymeWrapper.find('input');

    expect(input.is('[name="myInputName"]')).toEqual(true);
  });
});
