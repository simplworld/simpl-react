import React from 'react';

import { connect } from 'react-redux';


export function registers(Component, procedure, options = {}) {
  const defaults = { match: 'prefix' };
  const optionsWithDefaults = Object.assign(defaults, {}, options);

  const mapStateToProps = (state) => ({
    Autobahn: state.wamp.Autobahn,
  });

  const mapDispatchToProps = () => ({
  });

  class Listener extends React.Component {
    componentDidMount() {
      this.registrations = [];

      // eslint-disable-next-line no-unused-vars
      this.props.Autobahn.Connection.onReady(([session, details]) => {
        this.register(session);
      });
      // eslint-disable-next-line no-unused-vars
      this.props.Autobahn.Connection.onLost(([session, details]) => {
        this.register(this.props.Autobahn);
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
        this.props.Autobahn.unregister(registration);
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

  return connect(mapStateToProps, mapDispatchToProps)(Listener);
}


export default registers;
