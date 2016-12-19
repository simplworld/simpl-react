"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Check if the provided values is smaller than the `min` prop.
 *
 * @param      {string}  value     The value to validate
 * @param      {object}  ownProps  The component's own properties
 * @return     {string|null}  Either an error message, or `null`
 */
var min = exports.min = function min(value, ownProps) {
  if (ownProps.min !== undefined && parseFloat(value) < ownProps.min) {
    return "Value can't be less than " + ownProps.min + ".";
  }
  return null;
};

/**
 * Check if the provided values is greater than the `max` prop.
 *
 * @param      {string}  value     The value to validate
 * @param      {object}  ownProps  The component's own properties
 * @return     {string|null}  Either an error message, or `null`
 */
var max = exports.max = function max(value, ownProps) {
  if (ownProps.max !== undefined && parseFloat(value) > ownProps.max) {
    return "Value can't be greater than " + ownProps.max + ".";
  }
  return null;
};