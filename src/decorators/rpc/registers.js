import React from 'react';

import AutobahnReact from '../../autobahn';


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
      AutobahnReact.Connection.onReady(([session, details]) => {
        this.register(session);
      });
      // eslint-disable-next-line no-unused-vars
      AutobahnReact.Connection.onLost(([session, details]) => {
        this.register(AutobahnReact);
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
        AutobahnReact.unregister(registration);
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
  };

  return Listener;
}


export default registers;
