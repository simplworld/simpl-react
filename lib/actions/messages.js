import { createNamedAction } from '../utils/actions'

/*
 * action creators
 */

export const appendMessage = createNamedAction('MESSAGE_APPEND')
export const updateMessage = createNamedAction('MESSAGE_UPDATE')


export default {
    appendMessage,
    updateMessage
}
