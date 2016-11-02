import forms from './forms';
import messages from './messages';
import simpl from './simpl';
import state from './state';


/**
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
  forms,
  messages,
  simpl,
  state,
};
