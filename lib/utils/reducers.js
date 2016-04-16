import { updateInCollection } from './collections'


export function updateObjectOrCollection(state, action, updates) {
  if (action.payload.key !== undefined) {
    return updateInCollection(state, action.payload.key, updates)
  } else {
    return Object.assign({}, state, updates)
  }
}

export default {
    updateObjectOrCollection
}
