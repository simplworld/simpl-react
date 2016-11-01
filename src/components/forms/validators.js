export const min = (value, ownProps) => {
  if (value < ownProps.min) {
    return `Value can't be less than ${ownProps.min}.`;
  }
  return undefined;
};

export const max = (value, ownProps) => {
  if (value > ownProps.max) {
    return `Value can't be greater than ${ownProps.max}.`;
  }
  return undefined;
};
