'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.validateField = validateField;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reduxForm = require('redux-form');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint "no-underscore-dangle": "off" */


var verboseValidator = function verboseValidator(validation, value) {
  if (!value) {
    return null;
  }
  var messages = {
    isEmail: 'The specified value "' + value + '" is not a valid email address.',
    isNumeric: 'The specified value is not an integer.',
    isDecimal: 'The specified value is not a decimal.',
    isLowercase: 'The specified value must be lowercase',
    isUppercase: 'The specified value must be uppercase'
  };

  return _validator2.default[validation](value) ? null : messages[validation] || 'Invalid value';
};

/**
 * Convert a value to a string, if possible. Otherwise returns the unchanged
 * value. `null` and `undefined` are coerced to the empty string.
 *
 * @param      {any}   value   The value to coerced
 * @return     {any}  Either the value converted to a string, or the value itself.
 */
var stringValue = function stringValue(value) {
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
function validateField(_ref) {
  var errors = _ref.errors,
      warnings = _ref.warnings,
      sanitizers = _ref.sanitizers,
      formatters = _ref.formatters;

  var errorValidators = errors || [];
  var warningValidators = warnings || [];
  var optionsSanitizers = sanitizers || [];
  var optionsFormatters = formatters || [];

  return function (Component) {
    var parentProps = Component.defaultProps;

    var ValidatedComponent = function (_React$Component) {
      _inherits(ValidatedComponent, _React$Component);

      function ValidatedComponent(props, context) {
        _classCallCheck(this, ValidatedComponent);

        var _this = _possibleConstructorReturn(this, (ValidatedComponent.__proto__ || Object.getPrototypeOf(ValidatedComponent)).call(this, props, context));

        var formattedValue = '';
        if (![undefined, null, ''].includes(_this.props.initialValue)) {
          formattedValue = _this.format(_this.props.initialValue, _this.mergedProps(_this.props));
        }
        _this.state = {
          messages: _this.props.messages || [],
          validationState: null,
          value: formattedValue,
          hasReduxForm: context._reduxForm !== undefined,
          name: _this.props.name || _this.props.input.name
        };
        _this.onChange = _this.onChange.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        _this.onFocus = _this.onFocus.bind(_this);
        return _this;
      }

      _createClass(ValidatedComponent, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
          // add value and errors/warnings coming from redux-form

          if (_lodash2.default.isEqual(this.props, props)) {
            return;
          }

          var newState = {
            validationState: null,
            messages: []
          };

          if (props.meta) {
            if (props.meta.error) {
              newState.validationState = 'error';
              newState.messages.push(props.meta.error);
            } else if (props.meta.warning) {
              newState.validationState = 'warning';
              newState.messages.push(props.meta.warning);
            }
          }

          this.setState(newState);
        }
      }, {
        key: 'onChange',
        value: function onChange(e) {
          this.setState({
            value: e.target.value
          });

          if (this.state.hasReduxForm) {
            // Update the redux-form state is the field is decorated with `reduxForm'=
            this.context._reduxForm.dispatch(this.context._reduxForm.change(this.state.name, e.target.value));
          }

          if (this.props.onChange) {
            this.props.onChange(e);
          }
        }
      }, {
        key: 'onFocus',
        value: function onFocus(e) {
          this.setState({
            validationState: null,
            messages: []
          });

          if (this.props.focus) {
            this.props.focus(e);
          }
        }
      }, {
        key: 'onBlur',
        value: function onBlur(e) {
          if (this.props.readOnly === true) {
            if (this.props.blur) {
              this.props.blur(e);
            }
            return;
          }

          var originalValue = e.target.value;

          var _validate = this.validate(originalValue),
              validationState = _validate.validationState,
              allErrors = _validate.allErrors,
              allWarnings = _validate.allWarnings;

          var messages = [].concat(_toConsumableArray(allErrors), _toConsumableArray(allWarnings));

          var sanitizedValue = this.sanitize(originalValue, this.props);
          var formattedValue = this.format(originalValue, this.mergedProps(this.props));

          // If part of a redux form and there are errors, dispatch actions to
          // mark the form as invalid. Warnings will still allow the form to be
          // submitted.
          if (this.state.hasReduxForm) {
            var formName = this.context._reduxForm.form;
            var reduxFormErrors = _extends({}, this.props.form[formName].submitErrors);
            if (sanitizedValue === null || allErrors.length > 0) {
              reduxFormErrors[this.state.name] = allErrors.join(', ');
            } else {
              delete reduxFormErrors[this.state.name];
            }
            this.props.stopSubmit(formName, reduxFormErrors);
            this.context._reduxForm.dispatch(this.context._reduxForm.blur(this.state.name, e.target.value));
          }

          if (formattedValue !== null) {
            this.setState({
              value: formattedValue,
              validationState: validationState,
              messages: messages
            });
          }

          // the entered value is invalid
          if (sanitizedValue === null) {
            return;
          }

          if (this.props.blur) {
            var sanitizedTarget = _extends({}, e.target, { value: sanitizedValue });
            var sanitizedEvent = _extends({}, e, { target: sanitizedTarget });
            this.props.blur(sanitizedEvent, formattedValue);
          }
        }
      }, {
        key: 'validate',
        value: function validate(originalValue) {
          var allErrors = this.mapValidators([].concat(_toConsumableArray(this.props.errors), _toConsumableArray(errorValidators)), originalValue, this.props);
          var allWarnings = this.mapValidators([].concat(_toConsumableArray(this.props.warnings), _toConsumableArray(warningValidators)), originalValue, this.props);

          if (originalValue === '' && this.props.required === true) {
            allErrors.push('This field is required.');
          }

          var validationState = 'success';
          if (allErrors.length) {
            validationState = 'error';
          } else if (allWarnings.length) {
            validationState = 'warning';
          }

          return {
            validationState: validationState,
            allErrors: allErrors,
            allWarnings: allWarnings
          };
        }
      }, {
        key: 'mergedProps',
        value: function mergedProps(props) {
          return _extends({}, parentProps, props);
        }
      }, {
        key: 'mapValidators',
        value: function mapValidators(validators, value, props) {
          return validators.map(function (validation) {
            if (_lodash2.default.isFunction(validation)) {
              return validation(value, props);
            } else if (_lodash2.default.isString(validation)) {
              return verboseValidator(validation, stringValue(value));
            }
            return null;
          }).filter(function (result) {
            return result !== null;
          });
        }
      }, {
        key: 'sanitize',
        value: function sanitize(value, props) {
          var allSanitizers = [].concat(_toConsumableArray(props.sanitizers), _toConsumableArray(optionsSanitizers));

          // `redux-form` commpatibility
          if (props.normalize) {
            allSanitizers.push(props.normalize);
          }

          var sanitizedValue = allSanitizers.reduce(function (previousValue, sanitizer) {
            var sanitizerFunc = sanitizer;
            if (_lodash2.default.isString(sanitizer)) {
              sanitizerFunc = _validator2.default[sanitizer];
            }

            var sanitized = sanitizerFunc(stringValue(previousValue));
            if (props.input.type === 'number' && isNaN(sanitized)) {
              return null;
            }
            return sanitized !== null ? sanitized : previousValue;
          }, value);
          return sanitizedValue;
        }
      }, {
        key: 'format',
        value: function format(value, props) {
          var allFormatters = [].concat(_toConsumableArray(props.formatters), _toConsumableArray(optionsFormatters));
          var formattedValue = allFormatters.reduce(function (previousValue, formatter) {
            return formatter(previousValue, props) || previousValue;
          }, value);
          return formattedValue;
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement(Component, _extends({}, this.state, {
              onChange: this.onChange,
              onBlur: this.onBlur,
              onFocus: this.onFocus,
              type: this.props.type,
              name: this.state.name,
              id: this.props.id,
              required: this.props.required,
              readOnly: this.props.readOnly
            }))
          );
        }
      }]);

      return ValidatedComponent;
    }(_react2.default.Component);

    ValidatedComponent.defaultProps = {
      errors: [],
      warnings: [],
      sanitizers: [],
      formatters: [],
      required: false,
      readOnly: false
    };

    ValidatedComponent.contextTypes = {
      _reduxForm: _react2.default.PropTypes.object
    };

    ValidatedComponent.propTypes = {
      name: _react2.default.PropTypes.string,
      input: _react2.default.PropTypes.object,
      id: _react2.default.PropTypes.string,
      required: _react2.default.PropTypes.bool,
      readOnly: _react2.default.PropTypes.bool,
      initialValue: _react2.default.PropTypes.any,
      type: _react2.default.PropTypes.string,
      meta: _react2.default.PropTypes.object,
      onChange: _react2.default.PropTypes.func,
      onBlur: _react2.default.PropTypes.func,
      blur: _react2.default.PropTypes.func,
      onFocus: _react2.default.PropTypes.func,
      messages: _react2.default.PropTypes.array,
      errors: _react2.default.PropTypes.array,
      warnings: _react2.default.PropTypes.array,
      sanitizers: _react2.default.PropTypes.array,
      formatters: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.func)
    };

    var mapStateToProps = function mapStateToProps(state, ownProps) {
      return {
        form: state.form
      };
    };
    var mapDispatchToProps = {
      stopSubmit: _reduxForm.stopSubmit
    };
    return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ValidatedComponent);
  };
}

exports.default = validateField;