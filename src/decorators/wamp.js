import React from 'react';

import Autobahn from 'autobahn-react';


/**
 * @function
 * @memberof Simpl.decorators
 */
export function wamp(Component, options = {}) {
  const defaults = {
    url: 'ws://localhost:8080/ws',
    realm: 'realm1',
    prefixes: {},
  };
  const optionsWithDefaults = Object.assign(defaults, {}, options);

  class WampContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        connected: false,
      };
    }
    componentWillMount() {
      // Callback called whenever the connection is lost
      Autobahn.Connection.onLost(() => {
        console.log('Connection lost :/!');
        this.setState({ connected: false });
      });
      // Callback called whenever the connection is ready
    // eslint-disable-next-line no-unused-vars
      Autobahn.Connection.onReady(([session, details]) => {
        console.log('Connection established!');
        Object.keys(optionsWithDefaults.prefixes).forEach((key) => {
          const value = optionsWithDefaults.prefixes[key];
          console.log('added prefix: ', key, value);
          session.prefix(key, value);
          this.setState({ connected: true });
        });
      });
      Autobahn.Connection.initialize(optionsWithDefaults.url, optionsWithDefaults.realm);
      if (optionsWithDefaults.username) {
        Autobahn.Auth.logIn({
          username: optionsWithDefaults.username,
          password: optionsWithDefaults.password,
        }).then(() => {
          console.log('authd');
          if (this.props.onReady) {
            this.props.onReady();
          }
        }).catch((err) => {
          console.log(err);
          console.log('not authd');
        });
      }
    }
    render() {
      if (!this.state.connected) {
        return (<div>Connecting...</div>);
      }
      return <Component {...this.props} {...this.state} />;
    }
  }

  WampContainer.propTypes = {
    onReady: React.PropTypes.func,
    Autobahn: React.PropTypes.object,
  };

  return WampContainer;
}

export default wamp;
