import React from 'react';
import PropTypes from 'prop-types';

import { calls } from '../decorators/rpc';


/**
 * @class RPCCaller
 * @extends {React.Component}
 * @memberof Simpl.components
 */
class RPCCaller extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const Child = React.Children.only(this.props.children).type;
    this.RpcContainer = calls(Child, this.props.callee, this.props.options);
  }
  render() {
    return (
      <div>
        <this.RpcContainer {...this.props} {...this.state} />
      </div>
    );
  }
}

RPCCaller.propTypes = {
  callee: PropTypes.string.isRequired,
  options: PropTypes.object,
};

export default RPCCaller;
