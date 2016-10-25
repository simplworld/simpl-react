import React from 'react';

import Autobahn from 'autobahn-react';


/**
 * @function
 * @memberof Simpl.decorators.rpc
 */
export function registers(Component, procedure, options = {}) {
  const defaults = { match: 'prefix' };
  const optionsWithDefaults = Object.assign(defaults, {}, options);


  class Listener extends React.Component {
    componentDidMount() {
      this.registrations = [];

      // eslint-disable-next-line no-unused-vars
      Autobahn.Connection.onReady(([session, details]) => {
        this.register(session);
      });
      // eslint-disable-next-line no-unused-vars
      Autobahn.Connection.onLost(([session, details]) => {
        this.register(Autobahn);
      });
    }
    componentWillUnmount() {
      this.unregister();
    }
    register(session) {
      const handler = this.props.onCalled.bind(this);
      session.register(procedure, handler, optionsWithDefaults).then((registration) => {
        this.registrations.push(registration);
        console.log("registered procedure " + procedure);
      });
    }
    unregister() {
      this.registrations.forEach(registration => {
        Autobahn.unregister(registration);
      });
    }
    render() {
      return <Component {...this.props} {...this.state} />;
    }
  }

  Listener.propTypes = {
    append: React.PropTypes.bool,
    options: React.PropTypes.object,
    onCalled: React.PropTypes.func,
    Autobahn: React.PropTypes.object,
  };

  return Listener;
}


export default registers;
