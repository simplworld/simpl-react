import combined from './combined';
import messages from './messages';
import simpl from './simpl';


/**
 * @namespace reducers
 * @memberof Simpl
 */

export const combinedReducer = combined;
export const messagesReducer = messages;
export const simplReducer = simpl;

export default {
  combined,
  messages,
  simpl,
};
