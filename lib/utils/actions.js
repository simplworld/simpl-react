import { createAction } from 'redux-actions'


export function stringify(name, arg) {
  arg.toString = () => name
  return arg;
}

export function createNamedAction(type, ...args) {
  return stringify(type, createAction(type, ...args));
}

export default {
    stringify,
    createNamedAction
}

module.exports = {
    stringify,
    createNamedAction
}
