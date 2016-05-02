import React from 'react'

import { subscribes } from '../decorators/pubsub'


export const TopicSubscriber = React.createClass({
  propTypes: {
    topic: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func,
    ]).isRequired,
    options: React.PropTypes.object,
  },
  render() {
    const Child = React.Children.only(this.props.children).type
    const SubscribedChild = subscribes(Child, this.props.topic, this.props.options)

    return (
      <div>
        <SubscribedChild {...this.props} {...this.state} />
      </div>
    )

  }
});

export default TopicSubscriber
