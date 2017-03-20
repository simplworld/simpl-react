import AutobahnReact from '../autobahn';
import Progress from '../components/Progress.react';

import { CONNECTION_STATUS } from '../constants';


export function wampSetup(component, options) {
  // Callback called whenever the connection is lost
  AutobahnReact.Connection.onLost(() => {
    console.log('Connection lost :/!');
    component.props.setConnectionStatus(CONNECTION_STATUS.OFFLINE);
  });
  // Callback called whenever the connection is ready
// eslint-disable-next-line no-unused-vars
  AutobahnReact.Connection.onReady(([session, details]) => {
    console.log('Connection established!');
    session.prefix('model', options.root_topic)
    Object.keys(options.prefixes).forEach((key) => {
      const value = options.prefixes[key];
      console.log('added prefix: ', key, value);
      session.prefix(key, value);
      component.props.setConnectionStatus(CONNECTION_STATUS.CONNECTED);
    });
  });
  AutobahnReact.Connection.initialize(options.url, options.realm);
  if (options.authid) {
    AutobahnReact.Auth.logIn({
      username: `${options.authid}`,
      password: options.password,
    }).then(() => {
      console.log('authd');
      if (component.props.onReady) {
        component.props.onReady();
      }
    }).catch((err) => {
      console.log(err);
      console.log('not authd');
    });
  }
}

export function wampOptionsWithDefaults(options) {
  const defaults = {
    url: 'ws://localhost:8080/ws',
    realm: 'realm1',
    prefixes: {},
    progressComponent: Progress,
  };
  return Object.assign({}, defaults, options);
}
