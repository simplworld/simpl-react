import React from 'react'

import Autobahn from 'autobahn-react'


export function calls(Component, procedure, options = {}) {
  const defaults =  {};
  options = Object.assign(defaults, {}, options);

  const Caller = React.createClass({
    call(payload) {
      const args = payload.args || []
      const kwargs = payload.kwargs || {}
      return Autobahn.call(procedure, args, kwargs, options)
    },
    render() {
      return <Component {...this.props} {...this.state} call={this.call} />;
    }

  });
  return Caller

}