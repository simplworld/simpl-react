import __request from 'superagent';
import superagentPromise from 'superagent-promise';
import { findWhere } from 'underscore';

var cookie = require('cookie-dough')();
var request = superagentPromise(__request, Promise);


export function makeRequest(requestParams, cache, lookup) {
  const cached = findWhere(cache, lookup);

  if (cached !== undefined) {
    return Promise.resolve({ body: cached });
  }

  requestParams.method = requestParams.method || 'GET';

  let _request = request(requestParams.method, requestParams.url)
    .set('X-CSRFToken', cookie.get('csrftoken'));

  _request = _request
    .query(requestParams.query)
    .send(requestParams.params);
  return _request;
}

export function putPostParams(request_) {
  const requestParams = {};
  if (request_.params.id) {
    requestParams.method = 'PUT';
    requestParams.url = `${request.url}${request.params.id}/`;
  } else {
    requestParams.method = 'POST';
  }
  return Object.assign({}, request_, requestParams);
}

export function makePayloadRequest(request_, payload) {
  return makeRequest(request_)
  .then((res) => Object.assign({}, res, payload), (err) => {
    throw Object.assign({}, err, payload);
  });
}


function InvalidObjectException(message) {
  this.message = message;
  this.name = 'InvalidObjectException';
}
/**
 * Example:
 *
 *   const Business = Resource({
 *     url: '/apis/business',
 *     actions: {
 *       save: saveBusiness,
 *       delete: deleteBusiness
 *     }
 *   })
 *   const acme = Business({name: 'acme'})
 *   const businesses = Business.filter({search: 'acm'})
 *
 * `get` only works by ID for now.
 *   const acme = Business.get(7)
 *
 * All methods except `get` will accept an optional `extraPayload` argument.
 * Use it to pass data from the when the action is dispatched up to when the
 * promise is fulfilled.
 *
 *   const extraPayload = {extraInfo: 'arbitrary data to pass around'}
 *
 * Dispatch the instance's save *action*:
 *
 *   acme.save(extraPayload)
 *
 * Issue the actual network request:
 *
 *   acme._rest.save(payload)
 *
 * Resource methods:
 *
 *   MyResource.filter(query)
 *   MyResource.get(id)
 *   MyResource.add(object)
 *   MyResource.remove(lookup)
 *   MyResource.update(key, object)
 *
 * Instance methods:
 *
 *   myInstance.save()
 *   myInstance.delete()
 */
export function Resource(config) {
  const factory = (data) => {
    const instance = Object.assign({}, data, {
      _config: config,
      _rest: {
        save: (extraPayload) => {
          const request_ = putPostParams({
            url: config.url,
            params: data,
          });
          return makePayloadRequest(request_, extraPayload);
        },
        delete: (extraPayload) => {
          if (data.id === undefined || data.id === null) {
            const err = new InvalidObjectException('Object was never saved.');
            return Promise.reject(Object.assign({}, err, extraPayload));
          }
          return makePayloadRequest({ url: `${config.url}${data.id}/`, method: 'DELETE' }, extraPayload);
        },
      },
    })
    if (config.actions !== undefined) {
      if (config.actions.save) {
        instance.save = (payload) => {
          return instance._rest.save(payload)
          .then((res) => instance._config.actions.save(res));
        };
        instance.save.toString = config.actions.save.toString;
      }
      if (config.actions.delete) {
        instance.delete = (payload) => {
          return instance._rest.delete(payload)
          .then((res) => instance._config.actions.delete(res));
        };
        instance.delete.toString = config.actions.delete.toString;
      }
    }
    return instance;
  };
  factory.filter = (lookup, extraPayload) => {
    const request_ = {
      url: config.url,
      query: lookup,
    };
    return makePayloadRequest(request_, extraPayload);
  };
  factory.get = (id, cache, lookup) => makeRequest({ url: `${config.url}${id}/` }, cache, lookup);
  factory.add = config.actions.add;
  factory.remove = config.actions.remove;
  factory.update = config.actions.update;

  return factory;
}


export default {
  Resource,
};
