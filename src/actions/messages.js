import { createAction } from 'redux-actions';

/*
 * action creators
 */

export const appendMessage = createAction('simpl/MESSAGE_APPEND');
export const updateMessage = createAction('simpl/MESSAGE_UPDATE');


/**
 * @namespace messages
 * @memberof Simpl.actions
 */
export default {
  appendMessage,
  updateMessage,
};
