import React from 'react';

import { connect } from 'react-redux';
import {
  addChild, connectedScope, disconnectedScope, getDataTree, getRunUsers,
  removeChild, updateScope, getCurrentRunPhase
} from '../actions/simpl';

import { subscribes } from './pubsub/subscribes';
import wamp from './wamp';
import _ from 'lodash';


export function simpl(Component, options = {}) {
  const optionsWithDefaults = Object.assign({}, options, {});
  if (_.isFunction(options.topic)) {
    optionsWithDefaults.topic = options.topic();
  }

  const mapStateToProps = (state) => ({
    simplLoaded: state.simpl.loaded,
  });

  const mapDispatchToProps = (dispatch) => ({
    onReady() {
      if (optionsWithDefaults.topic) {
        dispatch(connectedScope(optionsWithDefaults.topic));
        dispatch(getRunUsers(optionsWithDefaults.topic));
        dispatch(getCurrentRunPhase(optionsWithDefaults.topic));
        return dispatch(getDataTree(optionsWithDefaults.topic));
      }
      return Promise.resolve();
    },
    onLeave() {
      if (optionsWithDefaults.topic) {
        return dispatch(disconnectedScope(optionsWithDefaults.topic));
      }
      return Promise.resolve();
    },
  });

  const appMapDispatchToProps = (dispatch, ownProps) => ({
    // eslint-disable-next-line camelcase
    onReceived([pk, resource_name, data], kwargs, event) {
      const topic = ownProps.Autobahn.Connection.currentConnection.session.resolve(
        optionsWithDefaults.topic
      );
      const actions = {
        [`${topic}.add_child`]: addChild,
        [`${topic}.remove_child`]: removeChild,
        [`${topic}.update_child`]: updateScope,
      };
      if (actions[event.topic]) {
        dispatch(actions[event.topic]({ resource_name, data, pk }));
      }
    },
  });

  const AppContainer = React.createClass({
    propTypes: {
      simplLoaded: React.PropTypes.bool,
    },
    shouldComponentUpdate(nextProps, nextState) {
      if (this.props.simplLoaded) {
        return false;
      }
      return this.props !== nextProps || this.state !== nextState;
    },
    render() {
      return <Component {...this.props} {...this.state} />;
    },

  });

  const SubscribedAppContainer = connect(null, appMapDispatchToProps)(subscribes(AppContainer, [
    `${optionsWithDefaults.topic}.add_child`,
    `${optionsWithDefaults.topic}.update_child`,
    `${optionsWithDefaults.topic}.remove_child`,
  ]));

  const Simpl = React.createClass({
    propTypes: {
      simplLoaded: React.PropTypes.bool,
      onLeave: React.PropTypes.func,
      onReady: React.PropTypes.func.isRequired,
    },
    componentWillMount() {
      this.props.onReady();
      window.addEventListener('beforeunload', this.props.onLeave);
    },
    componentWillUnmount() {
      window.removeEventListener('beforeunload', this.props.onLeave);
    },
    render() {
      if (!this.props.simplLoaded) {
        return (<div>Loading data...</div>);
      }
      return <SubscribedAppContainer {...this.props} {...this.state} />;
    },
  });

  const SimplContainer = connect(mapStateToProps, mapDispatchToProps)(Simpl);
  const WampContainer = wamp(SimplContainer, optionsWithDefaults);

  return WampContainer;
}

export default simpl;
