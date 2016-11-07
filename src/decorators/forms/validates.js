import React from 'react';

import _ from 'lodash';
import validator from 'validator';


const verboseValidator = function verboseValidator(validation, value) {
  const messages = {
    isRequired: 'This field is required.',
    isEmail: `The specified value "${value}" is not a valid email address.`,
    isNumeric: 'The specified value is not an integer.',
    isLowercase: 'The specified value must be lowercase',
    isUppercase: 'The specified value must be uppercase',
  };

  return validator[validation](value) ? undefined : messages[validation] || 'Invalid value';
};


/**
 * Given an object of `props`, returns an object containing only the `props`
 * supported by `input` elements.
 *
 * @param      {Object}  props   The original `props`
 * @return     {Object}  The props for the `input`.
 */
const getInputProps = function getInputProps(props) {
  if (props.input) {
    // The component is called form a redux-form Field.
    // Use the `Field` properties, but also remember to call original
    // component's event handlers.
    const overrides = {};

    ['onChange', 'onBlur', 'onFocus'].forEach((method) => {
      if (props[method]) {
        const patched = (...args) => {
          props[method](...args);
          props.input[method](...args);
        };
        overrides[method] = patched;
      }
    });

    if (props.type) {
      overrides.type = props.type;
    }
    return Object.assign({}, props.input, overrides);
  }
  return {
    type: props.type,
    value: props.value,
    name: props.name,
    onChange: props.onChange,
    onBlur: props.onBlur,
    onFocus: props.onFocus,
    placeholder: props.placeholder,
    required: props.required,
    disabled: props.disabled,
    readOnly: props.readonly,
    maxLength: props.maxlength,
    min: props.min,
    max: props.max,
    step: props.step,
  };
};

/**
 * Convert a value to a string, if possible. Otherwise returns the unchanged
 * value. `null` and `undefined` are coerced to the empty string.
 *
 * @param      {any}   value   The value to coerced
 * @return     {any}  Either the value converted to a string, or the vlaue itself.
 */
const stringValue = function stringValue(value) {
  if (value === null || value === undefined) return '';
  return value.toString !== undefined ? value.toString() : value;
};

/**
 * Options to validate a component
 * @typedef {Object} ValidationOptions
 * @property      {Array<string, function>}   errors  An array of validators
 * that may return an error message. For available strings, see the npm [validator](https://www.npmjs.com/package/validator) package
 * @property      {Array<string, function>}   warnings   An array of validators
 * that may return a warning message. For available strings, see the npm [validator](https://www.npmjs.com/package/validator) package
 * @property      {Array<string, function>}   sanitizers  An array of saniters
 * to modify the field's returned value. For available strings, see the npm [validator](https://www.npmjs.com/package/validator) package
 * @property      {Array<function>}           formatters  An array of saniters
 * to modify the field's rendered value.
 */

/**
 * Add value validation to a single field.
 * @memberof Simpl.decorators.forms
 * @example
 * import React from 'react';
 *
 * import {validates} from 'simpl/lib/decorators/forms/validates';
 * import {FormControl} from 'react-bootstrap';
 *
 * const noSpam = (value, ownProps) => {
 *     // validation logic goes here
 *     if (value.endsWith('@spam.com')) {
 *         return "that's spam"
 *     }
 * };
 *
 * const itsNew = (value, ownProps) => {
 *     if (value === ownProps.previousEmail) {
 *         return "email didn't change"
 *     }
 * };
 *
 * function EmailField(props) {
 *     // all aestethics goes here
 *     return (
 *         <FormControl
 *             type="email"
 *             {...props}
 *         />
 *     )
 * }
 *
 * const ValidatingEmailField = validateField({
 *     errors: ['isEmail', noSpam],
 *     warnings: [itsNew]
 * )(EmailField);
 *
 * class MyComponent extends React.Component {
 *     render() {
 *         return(
 *             <div>
 *                 <ValidatingEmailField
 *                     previousEmail="my@email.com"
 *                     errors={['isRequired']}
 *                 />
 *             </div>
 *         );
 *     }
 * }
 *
 * @param      {ValidationOptions}  options  An object of options
 * @returns    {ReactElement} A React component.
 */
export function validateField({ errors, warnings, sanitizers, formatters }) {
  const errorValidators = errors || [];
  const warningValidators = warnings || [];
  const optionsSanitizers = sanitizers || [];
  const optionsFormatters = formatters || [];

  return (Component) => {
    const parentProps = Component.defaultProps;

    class ValidatedComponent extends React.Component {
      constructor(props) {
        super(props);

        let formattedValue = '';
        if (props.value !== undefined || props.value !== '') {
          formattedValue = this.format(props.value, this.mergedProps(this.props));
        }
        this.state = {
          messages: this.props.messages || [],
          validationState: null,
          value: formattedValue,
        };
        this.onChange = this.onChange.bind(this);
      }

      componentWillReceiveProps(props) {
        let formattedValue = '';
        if (props.value !== this.props.value) {
          if (props.value !== undefined || props.value !== '') {
            formattedValue = this.format(props.value, this.mergedProps(props));
          }
        }

        // add errors/warnings coming from redux-form
        let validationState = this.state.validationState;
        const messages = [...this.state.messages];

        if (props.meta) {
          if (props.meta.error) {
            validationState = 'error';
            messages.push(props.meta.error);
          } else if (props.meta.warning) {
            validationState = 'warning';
            messages.push(props.meta.warning);
          }
        }

        this.setState({
          value: formattedValue,
          validationState,
          messages,
        });
      }

      onChange(e) {
        const originalValue = e.target.value;

        const allErrors = this.mapValidators(
          [...this.props.errors, ...errorValidators], originalValue, this.props
        );
        const allWarnings = this.mapValidators(
          [...this.props.warnings, ...warningValidators], originalValue, this.props
        );

        let validationState = 'success';
        if (allErrors.length) {
          validationState = 'error';
        } else if (warnings.length) {
          validationState = 'warning';
        }

        const messages = [...allErrors, ...allWarnings];

        const sanitizedValue = this.sanitize(originalValue, this.props);
        const formattedValue = this.format(originalValue, this.mergedProps(this.props));

        this.setState({
          value: formattedValue,
          validationState,
          messages,
        });
        if (this.props.onChange) {
          this.props.onChange(sanitizedValue);
        }
      }

      mergedProps(props) {
        return Object.assign({}, parentProps, props);
      }

      mapValidators(validators, value, props) {
        return validators.map((validation) => {
          if (_.isFunction(validation)) {
            return validation(value, props);
          } else if (_.isString(validation)) {
            return verboseValidator(
              validation,
              stringValue(value)
            );
          }
          return undefined;
        }).filter((result) => result !== undefined);
      }

      sanitize(value, props) {
        const allSanitizers = [...props.sanitizers, ...optionsSanitizers];

        // `redux-form` commpatibility
        if (props.normalize) {
          allSanitizers.push(props.normalize);
        }

        const sanitizedValue = allSanitizers.reduce((previousValue, sanitizer) => {
          if (_.isFunction(sanitizer)) {
            return sanitizer(previousValue, props) || previousValue;
          } else if (_.isString(sanitizer)) {
            return validator[sanitizer](stringValue(previousValue)) || previousValue;
          }
          return undefined;
        }, value);
        return sanitizedValue;
      }

      format(value, props) {
        const allFormatters = [...props.formatters, ...optionsFormatters];
        const formattedValue = allFormatters.reduce(
          (previousValue, formatter) => formatter(previousValue, props) || previousValue
        , value);
        return formattedValue;
      }

      render() {
        const props = Object.assign({}, this.props, {
          onChange: this.onChange,
        });
        const inputProps = getInputProps(props);

        return (
          <span>
            <Component
              inputProps={inputProps}
              {...props}
              {...this.state}
            />
          </span>
        );
      }
    }

    ValidatedComponent.defaultProps = {
      errors: [],
      warnings: [],
      sanitizers: [],
      formatters: [],
    };

    ValidatedComponent.propTypes = {
      value: React.PropTypes.any,
      meta: React.PropTypes.object,
      onChange: React.PropTypes.func,
      messages: React.PropTypes.array,
      errors: React.PropTypes.array,
      warnings: React.PropTypes.array,
      sanitizers: React.PropTypes.array,
      formatters: React.PropTypes.arrayOf(React.PropTypes.func),
    };

    return ValidatedComponent;
  };
}

export default validateField;