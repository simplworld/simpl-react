/**
 * @namespace forms
 * @memberof Simpl.actions
 */
import { SubmissionError } from 'redux-form';

/**
 * Shows the errors raised from `FormError`
 * @memberof Simpl.actions.forms
 * @example
 * import {showErrors} from 'simpl/lib/actions/forms';
 * import {myAction} from '../../actions/MyActions';
 *
 * function mapDispatchToProps(dispatch, ownProps) {
 *   return {
 *     submitForm(values) {
 *       return showErrors(dispatch(myAction(values)));
 *     }
 *   }
 * }
 * @param      {Function}  fn      The `dispatch` function
 * @return     {Promise}
 */
export function showErrors(fn) {
  return fn.then((action) => {
    if (action.error) {
      const errors = action.payload.args[0];
      throw new SubmissionError(errors);
    }
    return action;
  });
}
