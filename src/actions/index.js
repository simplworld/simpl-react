import messages from './messages';
import simpl from './simpl';
import state from './state';


/**
 * An [FSA](https://github.com/acdlite/flux-standard-action)-compliant Redux
 * Action.
 * @typedef {function} ReduxAction
*/

export const MessagesActions = messages;
export const SimplActions = simpl;
export const StateActions = state;
/**
 * @namespace actions
 * @memberof Simpl
 */
export default {
  messages,
  simpl,
  state,
};
