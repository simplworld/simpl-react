'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.validateField = validateField;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var verboseValidator = function verboseValidator(validation, value) {
  var messages = {
    isRequired: 'This field is required.',
    isEmail: 'The specified value "' + value + '" is not a valid email address.',
    isNumeric: 'The specified value is not an integer.',
    isLowercase: 'The specified value must be lowercase',
    isUppercase: 'The specified value must be uppercase'
  };

  return _validator2.default[validation](value) ? undefined : messages[validation] || 'Invalid value';
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
      // Use the `Field` properties, but also remember to call original
      // component's event handlers.
      var overrides = {};

      ['onChange', 'onBlur', 'onFocus'].forEach(function (method) {
        if (props[method]) {
          var patched = function patched() {
            var _props$input;

            props[method].apply(props, arguments);
            (_props$input = props.input)[method].apply(_props$input, arguments);
          };
          overrides[method] = patched;
        }
      });

      if (props.type) {
        overrides.type = props.type;
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

      function ValidatedComponent(props) {
        _classCallCheck(this, ValidatedComponent);

        var _this = _possibleConstructorReturn(this, (ValidatedComponent.__proto__ || Object.getPrototypeOf(ValidatedComponent)).call(this, props));

        var formattedValue = '';
        if (props.value !== undefined || props.value !== '') {
          formattedValue = _this.format(props.value, _this.mergedProps(_this.props));
        }
        _this.state = {
          messages: _this.props.messages || [],
          validationState: null,
          value: formattedValue
        };
        _this.onChange = _this.onChange.bind(_this);
        return _this;
      }

      _createClass(ValidatedComponent, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
          var formattedValue = '';
          if (props.value !== this.props.value) {
            if (props.value !== undefined || props.value !== '') {
              formattedValue = this.format(props.value, this.mergedProps(props));
            }
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
          var originalValue = e.target.value;

          var allErrors = this.mapValidators([].concat(_toConsumableArray(this.props.errors), _toConsumableArray(errorValidators)), originalValue, this.props);
          var allWarnings = this.mapValidators([].concat(_toConsumableArray(this.props.warnings), _toConsumableArray(warningValidators)), originalValue, this.props);

          var validationState = 'success';
          if (allErrors.length) {
            validationState = 'error';
          } else if (allWarnings.length) {
            validationState = 'warning';
          }

          var messages = [].concat(_toConsumableArray(allErrors), _toConsumableArray(allWarnings));

          var sanitizedValue = this.sanitize(originalValue, this.props);
          var formattedValue = this.format(originalValue, this.mergedProps(this.props));

          this.setState({
            value: formattedValue,
            validationState: validationState,
            messages: messages
          });
          if (this.props.onChange) {
            this.props.onChange(sanitizedValue);
          }
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
            return undefined;
          }).filter(function (result) {
            return result !== undefined;
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
            if (_lodash2.default.isFunction(sanitizer)) {
              return sanitizer(previousValue, props) || previousValue;
            } else if (_lodash2.default.isString(sanitizer)) {
              return _validator2.default[sanitizer](stringValue(previousValue)) || previousValue;
            }
            return undefined;
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
            onChange: this.onChange
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
      formatters: []
    };

    ValidatedComponent.propTypes = {
      value: _react2.default.PropTypes.any,
      meta: _react2.default.PropTypes.object,
      onChange: _react2.default.PropTypes.func,
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