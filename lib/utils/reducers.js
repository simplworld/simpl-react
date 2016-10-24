'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.updateObjectOrCollection = updateObjectOrCollection;

var _collections = require('./collections');

function updateObjectOrCollection(state, action, updates) {
  var collection = void 0;

  if (action.payload.key !== undefined) {
    collection = (0, _collections.updateInCollection)(state, action.payload.key, updates);
  } else {
    collection = _extends({}, state, updates);
  }
  return collection;
}

exports.default = {
  updateObjectOrCollection: updateObjectOrCollection
};