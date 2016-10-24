"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.updateInCollection = updateInCollection;
exports.updateCollection = updateCollection;
exports.popAtIndex = popAtIndex;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function updateInCollection(collection, index, updates) {
  if (index === undefined || index === null || index >= collection.length) {
    return [].concat(_toConsumableArray(collection), [_extends({}, updates)]);
  }
  return [].concat(_toConsumableArray(collection.slice(0, index)), [_extends({}, collection[index], updates)], _toConsumableArray(collection.slice(index + 1)));
}

function updateCollection(collection, updates) {
  return collection.map(function (item) {
    return _extends({}, item, updates);
  });
}

function popAtIndex(collection, index) {
  if (index < 0) {
    return collection.slice(0, index);
  }
  return [].concat(_toConsumableArray(collection.slice(0, index)), _toConsumableArray(collection.slice(index + 1, collection.length)));
}

exports.default = {
  updateInCollection: updateInCollection,
  updateCollection: updateCollection,
  popAtIndex: popAtIndex
};