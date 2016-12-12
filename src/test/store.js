import { finalCreateStoreFactory } from '../stores';
import { simplReducers } from '../reducers/combined';

const rootReducer = simplReducers({});


function configureStore(initialState) {
  const finalCreateStore = finalCreateStoreFactory('production');
  const store = finalCreateStore(rootReducer, initialState);

  return store;
}

/**
 * A minimal, pre-configured store that can be used for testing.

 * @function store
 * @memberof Simpl.test
 */
export const store = configureStore();

export default store;
