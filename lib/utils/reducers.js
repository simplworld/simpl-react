"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateObjectOrCollection = updateObjectOrCollection;
exports.default = void 0;

var _collections = require("./collections");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function updateObjectOrCollection(state, action, updates) {
  var collection;

  if (action.payload.key !== undefined) {
    collection = (0, _collections.updateInCollection)(state, action.payload.key, updates);
  } else {
    collection = _extends({}, state, updates);
  }

  return collection;
}

var _default = {
  updateObjectOrCollection: updateObjectOrCollection
};
exports.default = _default;