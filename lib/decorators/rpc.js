import React from 'react'

import { connect } from 'react-redux'


export function registers(Component, procedure, options = {}) {
  const defaults =  { match: 'prefix' };
  options = Object.assign(defaults, {}, options);

  const mapStateToProps = (state, ownProps) => {
    return {
      Autobahn: state.wamp.Autobahn
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
  }

  const Listener = React.createClass({
    componentDidMount() {
      this.registrations = [];

      this.props.Autobahn.Connection.onReady(([session, details]) => {
        this.register(session);
      })
      this.register(this.props.Autobahn)
    },
    componentWillUnmount() {
      this.unregister()
    },
    register(session) {
      const handler = this.props.onCalled.bind(this)
      session.register(procedure, handler, options).then((registration) => {
        this.registrations.push(registration);
        console.log("registered procedure " + procedure);
      })
    },
    unregister() {
      this.registrations.forEach(registration => {
        this.props.Autobahn.unregister(registration);
      })
    },
    render() {
      return <Component {...this.props} {...this.state} />;
    }

  });
  return connect(mapStateToProps, mapDispatchToProps)(Listener)
}

export function calls(Component, procedure, options = {}) {
  const defaults =  {};
  options = Object.assign(defaults, {}, options);

  const mapStateToProps = (state, ownProps) => {
    return {
      Autobahn: state.wamp.Autobahn
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
  }

  const Caller = React.createClass({
    call(payload) {
      const args = payload.args || []
      const kwargs = payload.kwargs || {}
      return this.props.Autobahn.call(procedure, args, kwargs, options)
    },
    render() {
      return <Component {...this.props} {...this.state} call={this.call} />;
    }

  });
  return connect(mapStateToProps, mapDispatchToProps)(Caller)

}

export default {
  calls,
  registers
}
