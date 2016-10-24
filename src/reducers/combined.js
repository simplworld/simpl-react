import { combineReducers } from 'redux';

import { routerStateReducer } from 'redux-router';

import simpl from './simpl';
import wamp from './wamp';


export function routerReducers(reducers) {
  const combined = Object.assign({}, reducers, {
    router: routerStateReducer,
  });
  return combineReducers(combined);
}

export function wampReducers(reducers) {
  const combined = Object.assign({}, reducers, {
    router: routerStateReducer,
    wamp,
  });
  return combineReducers(combined);
}

export function simplReducers(reducers) {
  const combined = Object.assign({}, reducers, {
    router: routerStateReducer,
    simpl,
    wamp,
  });
  return combineReducers(combined);
}

export default {
  router: routerReducers,
  simpl: simplReducers,
  wamp: wampReducers,
};
