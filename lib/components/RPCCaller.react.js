import React from 'react';
import { calls } from '../decorators/rpc';


class RPCCaller extends React.Component {
  componentWillMount() {
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
  callee: React.PropTypes.string.isRequired,
  options: React.PropTypes.object,
};

export default RPCCaller;
