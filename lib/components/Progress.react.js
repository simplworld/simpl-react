'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Progress(props) {
  var text = props.progress === 'offline' ? 'Connecting…' : 'Loading data…';
  return _react2.default.createElement(
    'div',
    null,
    text
  );
}

exports.default = Progress;