import React from 'react'

import { connect } from 'react-redux'
import { addChild, connectedScope, getDataTree, removeChild, updateScope } from '../actions/simpl'

import { subscribes } from './pubsub'
import wamp from './wamp'


export function simpl(Component, options = {}) {
  const mapStateToProps = (state, ownProps) => {
    return {
      simpl_loaded: state.simpl.loaded,
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onReady() {
        if (options.topic) {
          dispatch(connectedScope(options.topic))
          return dispatch(getDataTree(options.topic))
        }
      }
    }
  }

  const appMapDispatchToProps = (dispatch, ownProps) => {
    return {
      onReceived([pk, resource_name, data], kwargs, event) {
        const topic = ownProps.Autobahn.Connection.currentConnection.session.resolve(options.topic)
        const actions = {
          [`${topic}.add_child`]: addChild,
          [`${topic}.remove_child`]: removeChild,
          [`${topic}.update_child`]: updateScope
        }
        if (actions[event.topic]) {
          dispatch(actions[event.topic]({resource_name: resource_name, data: data, pk: pk}))
        }
      }
    }
  }

  const AppContainer = React.createClass({
    shouldComponentUpdate(nextProps, nextState) {
      if (this.props.simpl_loaded) {
        return false
      }
      return this.props != nextProps || this.state !== nextState
    },
    render() {
      return <Component {...this.props} {...this.state} />;
    }

  })

  const SubscribedAppContainer = connect(null, appMapDispatchToProps)(subscribes(AppContainer, [`${options.topic}.add_child`, `${options.topic}.update_child`]))

  const Simpl = React.createClass({
    componentWillMount() {
      this.props.onReady()
    },
    render() {
      if (!this.props.simpl_loaded) {
        return (<div>Loading data...</div>)
      }
      return <SubscribedAppContainer {...this.props} {...this.state} />;
    }
  });

  const SimplContainer = connect(mapStateToProps, mapDispatchToProps)(Simpl)
  const WampContainer = wamp(SimplContainer, options)

  return WampContainer
}

export default simpl
