import combined from './combined';
import messages from './messages';
import simpl from './simpl';
import wamp from './wamp';


/**
 * @namespace reducers
 * @memberof Simpl
 */

export const combinedReducer = combined;
export const messagesReducer = messages;
export const simplReducer = simpl;
export const wampReducer = wamp;

export default {
  combined,
  messages,
  simpl,
  wamp,
};
