import React from 'react';

import { FormGroup, HelpBlock } from 'react-bootstrap';

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
 * @param      {Object}  options  An object of options:
 * * `errors`: An array of validators (names or functions) that may return an
 * error message. For available names, see the npm [validator](https://www.npmjs.com/package/validator) package
 * * `warnings`: An array of validators (names or functions) that may return a warning
 * message. For available names, see the npm [validator](https://www.npmjs.com/package/validator) package
 * * `sanitizers`: An array of saniters (names or functions) to modify the field's
 * returned value. For available names, see the npm [validator](https://www.npmjs.com/package/validator) package
 * * `formatters`: An array of saniters (functions) to modify the field's rendered
 * value.
 * @return     {Function}    A Component decorator with validation added. You can pass the
 * the `errors` and `warnings` props when instantiating this component to add
 * more validators.
 */
export function validateField(options) {
  const errorValidators = options.errors || [];
  const warningValidators = options.warnings || [];
  const optionsSanitizers = options.sanitizers || [];
  const optionsFormatters = options.formatters || [];

  return (Component) => {
    const parentProps = Component.defaultProps;

    class ValidatedComponent extends React.Component {
      constructor(props) {
        super(props);

        let formattedValue = '';
        if (props.value !== undefined || props.value !== '') {
          const sanitizedValue = this.sanitize(props.value, this.props);
          formattedValue = this.format(sanitizedValue, this.mergedProps(this.props));
        }
        this.state = {
          messages: this.props.messages || [],
          validationState: null,
          value: formattedValue,
        };
        this.onChange = this.onChange.bind(this);
      }

      onChange(e) {
        const originalValue = e.target.value;

        const errors = this.mapValidators(
          [...this.props.errors, ...errorValidators], originalValue, this.props
        );
        const warnings = this.mapValidators(
          [...this.props.warnings, ...warningValidators], originalValue, this.props
        );

        let validationState = 'success';
        if (errors.length) {
          validationState = 'error';
        } else if (warnings.length) {
          validationState = 'warning';
        }

        const messages = [...errors, ...warnings];

        const sanitizedValue = this.sanitize(originalValue, this.props);
        const formattedValue = this.format(sanitizedValue, this.mergedProps(this.props));

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
            return verboseValidator(validation, value.toString());
          }
          return undefined;
        }).filter((result) => result !== undefined);
      }

      sanitize(value, props) {
        const sanitizers = [...props.sanitizers, ...optionsSanitizers];

        // `redux-form` commpatibility
        if (props.normalize) {
          sanitizers.push(props.normalize);
        }

        const sanitizedValue = sanitizers.reduce((previousValue, sanitizer) => {
          if (_.isFunction(sanitizer)) {
            return sanitizer(previousValue, props) || previousValue;
          } else if (_.isString(sanitizer)) {
            return validator[sanitizer](previousValue.toString()) || previousValue;
          }
          return undefined;
        }, value);
        return sanitizedValue;
      }

      format(value, props) {
        const formatters = [...props.formatters, ...optionsFormatters];
        const formattedValue = formatters.reduce(
          (previousValue, formatter) => formatter(previousValue, props) || previousValue
        , value);
        return formattedValue;
      }

      render() {
        let validationState = this.state.validationState;
        const messages = [...this.state.messages];

        // add errors/warnings coming from redux-form
        if (this.props.meta) {
          if (this.props.meta.error) {
            validationState = 'error';
            messages.push(this.props.meta.error);
          } else if (this.props.meta.warning) {
            validationState = 'warning';
            messages.push(this.props.meta.warning);
          }
        }

        const errors = messages.map((msg) => <HelpBlock key={msg}>{msg}</HelpBlock>);
        return (
          <span>
            <FormGroup
              validationState={validationState}
            >
              <Component
                onChange={this.onChange}
                {...this.props}
                {...this.state}
              />
              {errors}
            </FormGroup>
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
