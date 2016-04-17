import React from 'react'

import { connect } from 'react-redux'


const Message = function(payload) {
    return {args: payload[0], kwargs: payload[1], details: payload[2]}
}

export function subscribes(Component, topic, options = {}, staticMethods = {}) {
  const defaults =  { match: 'prefix' };
  options = Object.assign(defaults, {}, options);

  const mapStateToProps = (state, ownProps) => {
    return {
      Autobahn: state.pubsub.Autobahn
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onMessage(...args) {
        const store = ownProps.append === undefined ? true : ownProps.append
        const action = store ? this.appendMessage : this.updateMessage

        action({topic, ...args})

        if (ownProps.onReceived !== undefined) {
          ownProps.onReceived(topic, ...args)
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
    appendMessage(action) {
      const message = Message(action)

      const newVar = [...this.state.data || [], message]

      this.setState({
        data: newVar
      })
    },
    updateMessage(action) {
      const message = Message(action)

      const newState =  Object.assign({}, this.state, {data: message})
      this.setState({
        data: message
      })
    },
    componentDidMount() {
      this.subscriptions = [];

      this.props.Autobahn.Connection.onReady(([session, details]) => {
        this.subscribe_to(session)
      })
    },
    subscribe_to(session) {
      const handler = this.props.onMessage.bind(this)

      session.subscribe(topic, handler, options)
      .then(subscription => {
        this.subscriptions.push(subscription);
        console.log("Subscribed to " + topic)
      })
      .catch(error => {
        console.error("Failed to auto-subscribe to a topic: " + topic + " !", error);
      });
    },
    componentWillUnmount() {
      this.subscriptions.forEach(subscription => {
        session.unsubscribe(subscription);
      });
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
      Autobahn: state.pubsub.Autobahn
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
      return this.props.Autobahn.publish(topic, args, kwargs, options)
      .then(publication => {
        if (this.props.onPublished) {
          return this.props.onPublished(topic, args, kwargs, options, publication)
        }
      })
      .catch(error => {
        if (this.props.onPublishedError) {
          return this.props.onPublishedError(topic, args, kwargs, options, error)
        }
      });
    },
    render() {
      return <Component {...this.props} {...this.state} publish={this.publish} />;
    }

  });
  return connect(mapStateToProps, mapDispatchToProps)(Publisher)

}

module.exports = {
  publishes,
  subscribes
}