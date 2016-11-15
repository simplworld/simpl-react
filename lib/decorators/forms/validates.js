'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint "no-underscore-dangle": "off" */


exports.validateField = validateField;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reduxForm = require('redux-form');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
 * Given an object of `props`, returns an object containing only the `props`
 * supported by `input` elements.
 *
 * @param      {Object}  props   The original `props`
 * @return     {Object}  The props for the `input`.
 */
var getInputProps = function getInputProps(props) {
  if (props.input) {
    var _ret = function () {
      // The component is called form a redux-form Field.
      // Use the `Field` properties, but also remember the original
      // component's event handlers and value.
      var overrides = {};

      ['onChange', 'onBlur', 'onFocus'].forEach(function (method) {
        if (props[method]) {
          var patched = function patched(e, formattedValue) {
            props[method](e);
            props.input[method](formattedValue);
          };
          overrides[method] = patched;
        }
      });

      if (props.type) {
        overrides.type = props.type;
      }
      if (!['', null].includes(props.value)) {
        overrides.value = props.value;
      }
      return {
        v: _extends({}, props.input, overrides)
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
    step: props.step
  };
};

/**
 * Convert a value to a string, if possible. Otherwise returns the unchanged
 * value. `null` and `undefined` are coerced to the empty string.
 *
 * @param      {any}   value   The value to coerced
 * @return     {any}  Either the value converted to a string, or the vlaue itself.
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
        if (![undefined, null, ''].includes(props.value)) {
          formattedValue = _this.format(props.value, _this.mergedProps(_this.props));
        }
        _this.state = {
          messages: _this.props.messages || [],
          validationState: null,
          value: formattedValue,
          hasReduxForm: context._reduxForm !== undefined
        };
        _this.onChange = _this.onChange.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        _this.onFocus = _this.onFocus.bind(_this);
        return _this;
      }

      _createClass(ValidatedComponent, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
          if (props.value === undefined) {
            return;
          }
          var formattedValue = void 0;
          if (![undefined, null, ''].includes(props.value)) {
            formattedValue = this.format(props.value, this.mergedProps(props));
          } else {
            formattedValue = props.value;
          }

          // add errors/warnings coming from redux-form
          var validationState = this.state.validationState;
          var messages = [].concat(_toConsumableArray(this.state.messages));

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
            validationState: validationState,
            messages: messages
          });
        }
      }, {
        key: 'onChange',
        value: function onChange(e) {
          this.setState({
            value: e.target.value
          });

          if (this.state.hasReduxForm) {
            // Update the redux-form state is the field is decorated with `reduxForm'=
            this.context._reduxForm.dispatch(this.context._reduxForm.change(this.props.name, e.target.value));
          }
        }
      }, {
        key: 'onFocus',
        value: function onFocus() {
          this.setState({
            validationState: null,
            messages: []
          });
        }
      }, {
        key: 'onBlur',
        value: function onBlur(e) {
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
            if (sanitizedValue === null || allErrors.length > 0) {
              var reduxFormErrors = _defineProperty({}, this.props.name, allErrors.join(', '));
              var formName = this.context._reduxForm.form;
              this.context._reduxForm.dispatch((0, _reduxForm.stopSubmit)(formName, reduxFormErrors));
            }
          }

          if (formattedValue !== null) {
            this.setState({
              value: formattedValue,
              validationState: validationState,
              messages: messages
            });
          }
          // the enetered value is invalid
          if (sanitizedValue === null) {
            return;
          }

          if (this.props.onBlur) {
            var sanitizedTarget = _extends({}, e.target, { value: sanitizedValue });
            var sanitizedEvent = _extends({}, e, { target: sanitizedTarget });
            this.props.onBlur(sanitizedEvent, formattedValue);
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
            if (isNaN(sanitized)) {
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
          var props = _extends({}, this.props, {
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            onChange: this.onChange,
            value: [null, NaN].includes(this.state.value) ? '' : this.state.value
          });
          var inputProps = getInputProps(props);

          return _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement(Component, _extends({
              inputProps: inputProps
            }, props, this.state))
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
      required: false
    };

    ValidatedComponent.contextTypes = {
      _reduxForm: _react2.default.PropTypes.object
    };

    ValidatedComponent.propTypes = {
      name: _react2.default.PropTypes.string.isRequired,
      required: _react2.default.PropTypes.bool,
      value: _react2.default.PropTypes.any,
      meta: _react2.default.PropTypes.object,
      onChange: _react2.default.PropTypes.func,
      onBlur: _react2.default.PropTypes.func,
      messages: _react2.default.PropTypes.array,
      errors: _react2.default.PropTypes.array,
      warnings: _react2.default.PropTypes.array,
      sanitizers: _react2.default.PropTypes.array,
      formatters: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.func)
    };

    return ValidatedComponent;
  };
}

exports.default = validateField;