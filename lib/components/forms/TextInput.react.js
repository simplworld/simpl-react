'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextInput = undefined;

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
      _react2.default.createElement(_reactBootstrap.FormControl, props)
    ),
    errors
  );
}

Input.defaultProps = {
  type: 'text'
};

Input.propTypes = _props.inputPropTypes;

/**
 * A component that allows entering text.

 * Default validation options: `{sanitizers: ['trim']}`

 * Default props: `{type: 'text'}`
 * @namespace TextInput
 * @memberof Simpl.components.forms
 * @type {ReactElement}
 * @extends React.Component
 */
var TextInput = exports.TextInput = (0, _validates.validateField)({
  sanitizers: ['trim']
})(Input);

exports.default = TextInput;