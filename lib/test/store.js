"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.store = void 0;

var _stores = require("../stores");

var _combined = require("../reducers/combined");

var rootReducer = (0, _combined.simplReducers)({});

function configureStore(initialState) {
  var finalCreateStore = (0, _stores.finalCreateStoreFactory)('production');
  var store = finalCreateStore(rootReducer, initialState);
  return store;
}
/**
 * A minimal, pre-configured store that can be used for testing.

 * @function store
 * @memberof Simpl.test
 */


var store = configureStore();
exports.store = store;
var _default = store;
exports.default = _default;