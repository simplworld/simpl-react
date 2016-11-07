'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmailInput = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _validates = require('../../decorators/forms/validates');

var _props = require('./props');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Input(props) {
  var errors = props.messages.map(function (msg) {
    return _react2.default.createElement(
      _reactBootstrap.HelpBlock,
      { key: msg },
      msg
    );
  });

  return _react2.default.createElement(
    _reactBootstrap.FormGroup,
    {
      validationState: props.validationState
    },
    _react2.default.createElement(
      _reactBootstrap.InputGroup,
      null,
      _react2.default.createElement(
        _reactBootstrap.InputGroup.Addon,
        null,
        '@'
      ),
      _react2.default.createElement(_reactBootstrap.FormControl, props.inputProps)
    ),
    errors
  );
}

Input.defaultProps = {
  type: 'email'
};

Input.propTypes = _props.inputPropTypes;

/**
 * A component that allows entering and eamil address.

 * Default validation options:
 *  * `errors`: `['isEmail']`,
 *  * `sanitizers`: `['normalizeEmail']`
 *
 * Default props: `{type: 'email'}`
 * @namespace EmailInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
var EmailInput = exports.EmailInput = (0, _validates.validateField)({
  errors: ['isEmail'],
  sanitizers: ['normalizeEmail']
})(Input);

exports.default = EmailInput;