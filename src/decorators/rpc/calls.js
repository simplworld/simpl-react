import React from 'react';

import Autobahn from 'autobahn-react';


/**
 * @function
 * @memberof Simpl.decorators.rpc
 */
export function calls(Component, procedure, options = {}) {
  const defaults = {};
  const optionsWithDefaults = Object.assign(defaults, {}, options);

  class Caller extends React.Component {
    constructor(props) {
      super(props);
      this.call = this.call.bind(this);
    }
    call(payload) {
      const args = payload.args || [];
      const kwargs = payload.kwargs || {};
      return Autobahn.call(procedure, args, kwargs, optionsWithDefaults);
    }
    render() {
      return <Component {...this.props} {...this.state} call={this.call} />;
    }
  }

  Caller.propTypes = {
    Autobahn: React.PropTypes.object,
  };

  return Caller;
}

export default calls;
