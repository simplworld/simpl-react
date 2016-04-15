import React from 'react'
import { calls } from '../decorators/rpc'


const RPCCaller = React.createClass({
  propTypes: {
    callee: React.PropTypes.string.isRequired,
    options: React.PropTypes.object,
  },
  componentWillMount() {
    const Child = React.Children.only(this.props.children).type
    this.RpcContainer = calls(Child, this.props.callee, this.props.options)
  },
  render() {
    return (
      <div>
        <this.RpcContainer {...this.props} {...this.state} />
      </div>
    )

  }
});

export default RPCCaller
