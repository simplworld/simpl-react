import React from 'react'

import { connect } from 'react-redux'
import { getDataTree } from '../actions/simpl'

import wamp from './wamp'


export function SimplManager(state) {
  return {
    state: state,
    first(resource_name) {
      return [...this.state[resource_name] || []][0]
    },
    last(resource_name) {
      return [...this.state[resource_name] || []].pop()
    }
  }
}


export function simpl(Component, options = {}) {
  const mapStateToProps = (state, ownProps) => {
    return {
      simpl: state.simpl,
      SimplManager: SimplManager(state.simpl),
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onReady() {
        if (options.topic) {
            return dispatch(getDataTree(options.topic))
        }
      }
    }
  }

  const WampContainer = React.createClass({
    render() {
      return <Component {...this.props} {...this.state} />;
    }
  });

  const SimplContainer = wamp(WampContainer, options);

  return connect(mapStateToProps, mapDispatchToProps)(SimplContainer)
}

export default simpl