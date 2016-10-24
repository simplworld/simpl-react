import { updateInCollection } from './collections';


export function updateObjectOrCollection(state, action, updates) {
  let collection;

  if (action.payload.key !== undefined) {
    collection = updateInCollection(state, action.payload.key, updates);
  } else {
    collection = Object.assign({}, state, updates);
  }
  return collection;
}

export default {
  updateObjectOrCollection,
};
