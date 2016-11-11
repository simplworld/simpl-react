/**
 * Return a fixed-precision representation of the given value, according to
 * `props.decimalPlaces`
 *
 * @param      {string}  value     The input value
 * @param      {object}  ownProps  The component's own properties
 * @return     {string|null}  The formatted valued, or `null` if `value` is the
 * emptry string.
 */
export const decimalPlaces = function decimalPlaces(value, ownProps) {
  if (value === '') {
    return null;
  }
  return parseFloat(value).toFixed(ownProps.decimalPlaces);
};
