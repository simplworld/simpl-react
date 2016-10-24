import React from 'react';

import { connect } from 'react-redux';
import {
  addChild, connectedScope, disconnectedScope, getDataTree, getRunUsers,
  removeChild, updateScope, getCurrentRunPhase, getPhases, getRoles,
} from '../actions/simpl';

import { subscribes } from './pubsub/subscribes';
import wamp from './wamp';
import _ from 'lodash';


/**
 * @function
 * @memberof Simpl.decorators
 */
export function simpl(Component, options = {}) {
  const optionsWithDefaults = Object.assign({}, options, {});
  if (_.isFunction(options.topics)) {
    optionsWithDefaults.topics = options.topics();
  }

  const mapStateToProps = (state) => ({
    simplLoaded: state.simpl.loaded,
  });

  const mapDispatchToProps = (dispatch) => ({
    onReady() {
      if (optionsWithDefaults.topics) {
        optionsWithDefaults.topics.forEach((topic) => {
          dispatch(connectedScope(topic));
          dispatch(getRunUsers(topic));
          dispatch(getCurrentRunPhase(topic));
          dispatch(getDataTree(topic));
        });
      }
      dispatch(getPhases('model:model.game'));
      dispatch(getRoles('model:model.game'));
      return Promise.resolve();
    },
    onLeave() {
      if (optionsWithDefaults.topics) {
        optionsWithDefaults.topics.forEach((topic) => {
          dispatch(disconnectedScope(topic));
        });
      }
      return Promise.resolve();
    },
  });

  const appMapDispatchToProps = (dispatch, ownProps) => ({
    // eslint-disable-next-line camelcase
    onReceived([pk, resource_name, data], kwargs, event) {
      const resolvedTopics = optionsWithDefaults.topics.map(
        (topic) => ownProps.Autobahn.Connection.currentConnection.session.resolve(topic)
      );
      resolvedTopics.forEach((topic) => {
        const actions = {
          [`${topic}.add_child`]: addChild,
          [`${topic}.remove_child`]: removeChild,
          [`${topic}.update_child`]: updateScope,
        };
        if (actions[event.topic]) {
          dispatch(actions[event.topic]({ resource_name, data, pk }));
        }
      });
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

  const appTopics = optionsWithDefaults.topics.reduce(
    (memo, topic) => memo.concat([
      `${topic}.add_child`,
      `${topic}.update_child`,
      `${topic}.remove_child`,
    ])
  , []);
  const SubscribedAppContainer = connect(
    null, appMapDispatchToProps
  )(subscribes(AppContainer, appTopics));

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

/**
 * @namespace simpl
 * @memberof Simpl.decorators
 */
export default simpl;
