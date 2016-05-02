import React from 'react'

import { connect } from 'react-redux'
import _ from 'lodash'


export function subscribes(Component, topics, options = {}, staticMethods = {}) {
  const defaults =  { match: 'prefix' };
  options = Object.assign(defaults, {}, options);

  const mapStateToProps = (state, ownProps) => {
    return {
      Autobahn: state.wamp.Autobahn
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onMessage(args, kwargs, event) {
        const store = ownProps.append === undefined ? true : ownProps.append
        const action = store ? this.appendMessage : this.updateMessage

        action({args, kwargs, event})
        if (ownProps.onReceived !== undefined) {
          ownProps.onReceived(args, kwargs, event)
        }
      }
    }
  }

  const SubscriptionContainer = React.createClass({
    propTypes: {
      append: React.PropTypes.bool,
      options: React.PropTypes.object,
      onMessage: React.PropTypes.func
    },
    getInitialState() {
      return {
        data: []
      }
    },
    getTopics() {
      let resolved_topics
      if (!_.isArray(topics)) {
        resolved_topics = [topics]
      } else {
        resolved_topics = [...topics]
      }
      return resolved_topics.map((topic) => {
        if (_.isFunction(topic)) {
          return topic.bind(this)(this.props)
        }
        return topic
      })
    },
    appendMessage(message) {
      const newVar = [...this.state.data || [], message]

      this.setState({
        data: newVar
      })
    },
    updateMessage(message) {
      const newState =  Object.assign({}, this.state, {data: message})
      this.setState({
        data: message
      })
    },
    shouldComponentUpdate(nextProps, nextState) {
      return this.props != nextProps || this.state !== nextState
    },
    componentDidMount() {
      this.subscriptions = [];

      this.props.Autobahn.Connection.onReady(([session, details]) => {
        this.subscribe_to(session)
      })
      this.subscribe_to(this.props.Autobahn)
    },
    subscribe_to(session) {
      const handler = this.props.onMessage.bind(this)
      const resolved_topics = this.getTopics()

      resolved_topics.forEach((topic) => {
        session.subscribe(topic, handler, options)
        .then(subscription => {
          this.subscriptions.push(subscription);
          console.log("Subscribed to " + topic)
        })
        .catch(error => {
          console.error("Failed to auto-subscribe to a topic: " + topic + " !", error);
        });
      })
    },
    unsubscribe() {
      this.subscriptions.forEach(subscription => {
        console.log(`Unsubscribing from '${subscription.topic}'`)
        this.props.Autobahn.unsubscribe(subscription);
      });
    },
    componentWillUnmount() {
      const resolved_topics = this.getTopics()
      console.log(`Unmounting ${resolved_topics}`)
      this.unsubscribe()
    },

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  });

  for (var functionName in staticMethods) {
    SubscriptionContainer[functionName] = staticMethods[functionName];
  }

  return connect(mapStateToProps, mapDispatchToProps)(SubscriptionContainer)
};


export function publishes(Component, topic, options = {}) {
  const defaults =  { acknowledge: true, disclose_me: true, exclude_me: false };
  options = Object.assign(defaults, {}, options);


  const mapStateToProps = (state, ownProps) => {
    return {
      Autobahn: state.wamp.Autobahn
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
  }

  const Publisher = React.createClass({
    publish(payload) {
      const args = payload.args || []
      const kwargs = payload.kwargs || {}
      let resolved_topic = topic

      if (_.isFunction(topic)) {
        resolved_topic = topic.bind(this)(this.props)
      }
      return this.props.Autobahn.publish(resolved_topic, args, kwargs, options)
      .then(publication => {
        if (this.props.onPublished) {
          return this.props.onPublished(resolved_topic, args, kwargs, options, publication)
        }
      })
      .catch(error => {
        if (this.props.onPublishedError) {
          return this.props.onPublishedError(resolved_topic, args, kwargs, options, error)
        }
      });
    },
    render() {
      return <Component {...this.props} {...this.state} publish={this.publish} />;
    }

  });
  return connect(mapStateToProps, mapDispatchToProps)(Publisher)

}

export default {
  publishes,
  subscribes
}
