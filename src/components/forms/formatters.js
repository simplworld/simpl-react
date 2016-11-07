/**
 * Return a fixed-precision representation of the given value, according to
 * `props.decimalPlaces`
 *
 * @param      {string}  value     The input value
 * @param      {object}  ownProps  The component's own properties
 * @return     {string}  The formatted valued
 */
export const decimalPlaces = function decimalPlaces(value, ownProps) {
  return parseFloat(value).toFixed(ownProps.decimalPlaces);
};
