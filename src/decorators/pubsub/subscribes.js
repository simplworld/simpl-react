import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import _ from 'lodash';
import AutobahnReact from '../../autobahn';


/**
 * @function subscribes
 * @memberof Simpl.decorators.pubsub
 */
export function subscribes(topics, options = {}, staticMethods = {}) {
  return (Component) => {
    const defaults = { match: 'prefix' };
    const optionsWithDefaults = Object.assign(defaults, {}, options);

    const mapDispatchToProps = (dispatch, ownProps) => ({
      onMessage(args, kwargs, event) {
        const store = ownProps.append === undefined ? true : ownProps.append;
        const action = store ? this.appendMessage : this.updateMessage;

        action({ args, kwargs, event });
        if (ownProps.onReceived !== undefined) {
          ownProps.onReceived(args, kwargs, event);
        }
      },
    });

    class SubscriptionContainer extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          data: [],
        };
        this.appendMessage = this.appendMessage.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
      }
      componentDidMount() {
        this.subscriptions = [];
        // eslint-disable-next-line no-unused-vars
        AutobahnReact.Connection.onReady(([session, details]) => {
          this.subscribeTo(session);
        });
        this.subscribeTo(AutobahnReact);
      }
      shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps || this.state !== nextState;
      }
      componentWillUnmount() {
        const resolvedTopics = this.getTopics();
        console.log(`Unmounting ${resolvedTopics}`);
        this.unsubscribe();
      }
      getTopics() {
        let resolvedTopics;
        if (!_.isArray(topics)) {
          resolvedTopics = [topics];
        } else {
          resolvedTopics = [...topics];
        }
        return resolvedTopics.map((topic) => {
          if (_.isFunction(topic)) {
            return topic.bind(this)(this.props);
          }
          return topic;
        });
      }
      subscribeTo(session) {
        const handler = this.props.onMessage.bind(this);
        const resolvedTopics = this.getTopics();
        console.log(`subscribeTo: resolvedTopics:`, resolvedTopics);
        resolvedTopics.forEach((topic) => {
          session.subscribe(topic, handler, optionsWithDefaults)
          .then(subscription => {
            this.subscriptions.push(subscription);
            console.log(`Subscribed to ${topic}`);
          })
          .catch(error => {
            console.error(`Failed to auto-subscribe to a topic: ${topic}!`, error);
          });
        });
      }
      unsubscribe() {
        this.subscriptions.forEach(subscription => {
          console.log(`Unsubscribing from '${subscription.topic}'`);
          AutobahnReact.unsubscribe(subscription);
        });
      }
      appendMessage(message) {
        const newVar = [...this.state.data || [], message];

        this.setState({
          data: newVar,
        });
      }
      updateMessage(message) {
        this.setState({
          data: message,
        });
      }
      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    SubscriptionContainer.propTypes = {
      append: PropTypes.bool,
      options: PropTypes.object,
      onMessage: PropTypes.func,
    };

    for (var functionName in staticMethods) {
      SubscriptionContainer[functionName] = staticMethods[functionName];
    }

    return connect(null, mapDispatchToProps)(SubscriptionContainer);
  };
}

export default subscribes;
