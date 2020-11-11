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
  console.log("Options!");
  console.dir(options);
  AutobahnReact.Connection.makeConnection({
    url: options.url,
    realm: options.realm,
    authmethods: ['ticket'],
    authid: options.authid,
    onchallenge: (session, method, extra) => {
      console.log("In challenge!")
      console.dir(session);
      console.dir(method);
      console.dir(extra);
      return (options.password);
    },
  }).then(() => {
    console.log(`Authentication as authid=${options.authid} successful!`);
    if (component.props.onReady) {
      component.props.onReady();
    }
  }).catch((err) => {
    console.log(err);
    console.log(`Unable to authenticate as authid=${options.authid}`);
  });

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
