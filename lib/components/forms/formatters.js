'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Return a fixed-precision representation of the given value, according to
 * `props.decimalPlaces`
 *
 * @param      {string}  value     The input value
 * @param      {object}  ownProps  The component's own properties
 * @return     {string|null}  The formatted valued, or `null` if `value` is the
 * emptry string.
 */
var decimalPlaces = exports.decimalPlaces = function decimalPlaces(value, ownProps) {
  if (value === '') {
    return null;
  }
  var float = parseFloat(value);
  if (isNaN(float)) {
    return null;
  }
  return float.toFixed(ownProps.decimalPlaces);
};