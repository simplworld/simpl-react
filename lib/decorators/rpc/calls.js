import React from 'react';

import { connect } from 'react-redux';


/**
 * @function
 * @memberof Simpl.decorators.rpc
 */
export function calls(Component, procedure, options = {}) {
  const defaults = {};
  const optionsWithDefaults = Object.assign(defaults, {}, options);

  const mapStateToProps = (state) => ({
    Autobahn: state.wamp.Autobahn,
  });

  const mapDispatchToProps = () => ({
  });

  class Caller extends React.Component {
    constructor(props) {
      super(props);
      this.call = this.call.bind(this);
    }
    call(payload) {
      const args = payload.args || [];
      const kwargs = payload.kwargs || {};
      return this.props.Autobahn.call(procedure, args, kwargs, optionsWithDefaults);
    }
    render() {
      return <Component {...this.props} {...this.state} call={this.call} />;
    }
  }

  Caller.propTypes = {
    Autobahn: React.PropTypes.object,
  };

  return connect(mapStateToProps, mapDispatchToProps)(Caller);
}

export default calls;
