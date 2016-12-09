import { finalCreateStoreFactory } from '../src/stores';
import { simplReducers } from '../src/reducers/combined';

const rootReducer = simplReducers({});


function configureStore(initialState) {
  const finalCreateStore = finalCreateStoreFactory('production');
  const store = finalCreateStore(rootReducer, initialState);

  return store;
}

export const store = configureStore();

export default store;
