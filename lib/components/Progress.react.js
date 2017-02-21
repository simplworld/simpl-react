'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Progress(props) {
  var text = void 0;
  if (props.connectionStatus === _constants.CONNECTION_STATUS.CONNECTING) {
    text = 'Connecting…';
  } else if (props.connectionStatus === _constants.CONNECTION_STATUS.CONNECTED) {
    text = 'Loading data…';
  } else if (props.connectionStatus === _constants.CONNECTION_STATUS.OFFLINE) {
    text = 'Connection lost. If this persist, please contact the administrator.';
  }
  return _react2.default.createElement(
    'div',
    null,
    text
  );
}

Progress.propTypes = {
  connectionStatus: _react2.default.PropTypes.string.isRequired
};

exports.default = Progress;