"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateInCollection = updateInCollection;
exports.updateCollection = updateCollection;
exports.popAtIndex = popAtIndex;
exports.default = void 0;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function updateInCollection(collection, index, updates) {
  if (index === undefined || index === null || index >= collection.length) {
    return _toConsumableArray(collection).concat([_extends({}, updates)]);
  }

  return _toConsumableArray(collection.slice(0, index)).concat([_extends({}, collection[index], updates)], _toConsumableArray(collection.slice(index + 1)));
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

  return _toConsumableArray(collection.slice(0, index)).concat(_toConsumableArray(collection.slice(index + 1, collection.length)));
}

var _default = {
  updateInCollection: updateInCollection,
  updateCollection: updateCollection,
  popAtIndex: popAtIndex
};
exports.default = _default;