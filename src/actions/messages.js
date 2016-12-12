import { createNamedAction } from '../utils/actions';

/*
 * action creators
 */

export const appendMessage = createNamedAction('simpl/MESSAGE_APPEND');
export const updateMessage = createNamedAction('simpl/MESSAGE_UPDATE');


/**
 * @namespace messages
 * @memberof Simpl.actions
 */
export default {
  appendMessage,
  updateMessage,
};
