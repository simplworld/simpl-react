/**
 * @namespace combined
 * @memberof Simpl.reducers
 */
import { combineReducers } from 'redux';

import { routerReducer as routing } from 'react-router-redux';

import simpl from './simpl';


export function routerReducers(reducers) {
  const combined = Object.assign({}, reducers, {
    routing,
  });
  return combineReducers(combined);
}

export function wampReducers(reducers) {
  const combined = Object.assign({}, reducers, {
    routing,
  });
  return combineReducers(combined);
}

/**
 * Returns a reducer function for your reducers, qdding two additional reducers
 * for `routing` and `simpl` state.
 *
 * @param      {object}  reducers  Your custom reducers
 * @return     {function}  A reducer function
 */
export function simplReducers(reducers) {
  const combined = Object.assign({}, reducers, {
    routing,
    simpl,
  });
  return combineReducers(combined);
}

export default {
  routing: routerReducers,
  simplReducers,
};
