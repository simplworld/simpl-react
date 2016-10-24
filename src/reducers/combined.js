import { combineReducers } from 'redux';

import { routeReducer as routing } from 'react-router-redux';

import simpl from './simpl';
import wamp from './wamp';


export function routerReducers(reducers) {
  const combined = Object.assign({}, reducers, {
    routing,
  });
  return combineReducers(combined);
}

export function wampReducers(reducers) {
  const combined = Object.assign({}, reducers, {
    routing,
    wamp,
  });
  return combineReducers(combined);
}

export function simplReducers(reducers) {
  const combined = Object.assign({}, reducers, {
    routing,
    simpl,
    wamp,
  });
  return combineReducers(combined);
}

export default {
  routing: routerReducers,
  simpl: simplReducers,
  wamp: wampReducers,
};
