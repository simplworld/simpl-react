"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Progress(props) {
  var text;

  if (props.connectionStatus === _constants.CONNECTION_STATUS.CONNECTING) {
    text = 'Connecting…';
  } else if (props.connectionStatus === _constants.CONNECTION_STATUS.CONNECTED) {
    text = 'Loading data…';
  } else if (props.connectionStatus === _constants.CONNECTION_STATUS.OFFLINE) {
    text = 'Connection lost. If the problem persists, please contact the administrator.';
  }

  return _react.default.createElement("div", null, text);
}

Progress.propTypes = {
  connectionStatus: _propTypes.default.string.isRequired
};
var _default = Progress;
exports.default = _default;