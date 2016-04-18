import React from 'react'

import { connect } from 'react-redux'


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

export default calls
