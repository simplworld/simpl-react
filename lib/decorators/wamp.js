'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.wamp = wamp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobahnReact = require('autobahn-react');

var _autobahnReact2 = _interopRequireDefault(_autobahnReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @function
 * @memberof Simpl.decorators
 */
function wamp(Component) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var defaults = {
    url: 'ws://localhost:8080/ws',
    realm: 'realm1',
    prefixes: {}
  };
  var optionsWithDefaults = _extends(defaults, {}, options);

  var WampContainer = function (_React$Component) {
    _inherits(WampContainer, _React$Component);

    function WampContainer(props) {
      _classCallCheck(this, WampContainer);

      var _this = _possibleConstructorReturn(this, (WampContainer.__proto__ || Object.getPrototypeOf(WampContainer)).call(this, props));

      _this.state = {
        connected: false
      };
      return _this;
    }

    _createClass(WampContainer, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        // Callback called whenever the connection is lost
        _autobahnReact2.default.Connection.onLost(function () {
          console.log('Connection lost :/!');
          _this2.setState({ connected: false });
        });
        // Callback called whenever the connection is ready
        // eslint-disable-next-line no-unused-vars
        _autobahnReact2.default.Connection.onReady(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2);

          var session = _ref2[0];
          var details = _ref2[1];

          console.log('Connection established!');
          Object.keys(optionsWithDefaults.prefixes).forEach(function (key) {
            var value = optionsWithDefaults.prefixes[key];
            console.log('added prefix: ', key, value);
            session.prefix(key, value);
            _this2.setState({ connected: true });
          });
        });
        _autobahnReact2.default.Connection.initialize(optionsWithDefaults.url, optionsWithDefaults.realm);
        if (optionsWithDefaults.username) {
          _autobahnReact2.default.Auth.logIn({
            username: optionsWithDefaults.username,
            password: optionsWithDefaults.password
          }).then(function () {
            console.log('authd');
            if (_this2.props.onReady) {
              _this2.props.onReady();
            }
          }).catch(function (err) {
            console.log(err);
            console.log('not authd');
          });
        }
      }
    }, {
      key: 'render',
      value: function render() {
        if (!this.state.connected) {
          return _react2.default.createElement(
            'div',
            null,
            'Connecting...'
          );
        }
        return _react2.default.createElement(Component, _extends({}, this.props, this.state));
      }
    }]);

    return WampContainer;
  }(_react2.default.Component);

  WampContainer.propTypes = {
    onReady: _react2.default.PropTypes.func,
    Autobahn: _react2.default.PropTypes.object
  };

  return WampContainer;
}

exports.default = wamp;