import React from 'react';

import AutobahnReact from '../autobahn';

import Progress from '../components/Progress.react';

/**
 * @function
 * @memberof Simpl.decorators
 */
export function wamp(options = {}) {
  return (Component) => {
    const defaults = {
      url: 'ws://localhost:8080/ws',
      realm: 'realm1',
      prefixes: {},
      progressComponent: Progress,
    };
    const optionsWithDefaults = Object.assign({}, defaults, options);

    class WampContainer extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          progress: 'offline',
        };
      }
      componentWillMount() {
        // Callback called whenever the connection is lost
        AutobahnReact.Connection.onLost(() => {
          console.log('Connection lost :/!');
          this.setState({ progress: 'offline' });
        });
        // Callback called whenever the connection is ready
      // eslint-disable-next-line no-unused-vars
        AutobahnReact.Connection.onReady(([session, details]) => {
          console.log('Connection established!');
          Object.keys(optionsWithDefaults.prefixes).forEach((key) => {
            const value = optionsWithDefaults.prefixes[key];
            console.log('added prefix: ', key, value);
            session.prefix(key, value);
            this.setState({ progress: 'connected' });
          });
        });
        AutobahnReact.Connection.initialize(optionsWithDefaults.url, optionsWithDefaults.realm);
        if (optionsWithDefaults.username) {
          AutobahnReact.Auth.logIn({
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
        if (this.state.progress === 'offline') {
          return (
            <div className={`wamp wamp-${this.state.progress}`}>
              <optionsWithDefaults.progressComponent {...this.props} {...this.state} />
            </div>
          );
        }
        return (
          <div className={`wamp wamp-${this.state.progress}`}>
            <Component {...this.props} {...this.state} />
          </div>
        );
      }
    }

    WampContainer.propTypes = {
      onReady: React.PropTypes.func,
    };

    return WampContainer;
  };
}

export default wamp;
