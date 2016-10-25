import combined from './combined';
import messages from './messages';
import simpl from './simpl';

export const combinedReducer = combined;
export const messagesReducer = messages;
export const simplReducer = simpl;

/**
 * @namespace reducers
 * @memberof Simpl
 */
export default {
  combined,
  messages,
  simpl,
};
