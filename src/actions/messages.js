import { createNamedAction } from '../utils/actions';

/*
 * action creators
 */

export const appendMessage = createNamedAction('MESSAGE_APPEND');
export const updateMessage = createNamedAction('MESSAGE_UPDATE');


/**
 * @namespace messages
 * @memberof Simpl.actions
 */
export default {
  appendMessage,
  updateMessage,
};
