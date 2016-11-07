/**
 * Check if the provided values is smaller than the `min` prop.
 *
 * @param      {string}  value     The value to validate
 * @param      {object}  ownProps  The component's own properties
 * @return     {string|undefined}  Either an error message, or `undefined`
 */
export const min = (value, ownProps) => {
  if (parseFloat(value) < ownProps.min) {
    return `Value can't be less than ${ownProps.min}.`;
  }
  return undefined;
};

/**
 * Check if the provided values is greater than the `max` prop.
 *
 * @param      {string}  value     The value to validate
 * @param      {object}  ownProps  The component's own properties
 * @return     {string|undefined}  Either an error message, or `undefined`
 */
export const max = (value, ownProps) => {
  if (parseFloat(value) > ownProps.max) {
    return `Value can't be greater than ${ownProps.max}.`;
  }
  return undefined;
};
