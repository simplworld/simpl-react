export function updateInCollection(collection, index, updates) {
  if (index === undefined || index === null || index >= collection.length) {
    return [...collection, Object.assign({}, updates)];
  }
  return [
    ...collection.slice(0, index),
    Object.assign({}, collection[index], updates),
    ...collection.slice(index + 1),
  ];
}

export function updateCollection(collection, updates) {
  return collection.map((item) => Object.assign({}, item, updates));
}

export function popAtIndex(collection, index) {
  if (index < 0) {
    return collection.slice(0, index);
  }
  return [
    ...collection.slice(0, index),
    ...collection.slice(index + 1, collection.length),
  ];
}


export default {
  updateInCollection,
  updateCollection,
  popAtIndex,
};
