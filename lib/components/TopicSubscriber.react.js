import React from 'react'

import { subscribes } from '../decorators/pubsub'


const TopicSubscriber = React.createClass({
  propTypes: {
    topic: React.PropTypes.string.isRequired,
    options: React.PropTypes.object,
  },
  componentWillMount() {
    const Child = React.Children.only(this.props.children).type
    this.SubscribedChild = subscribes(Child, this.props.topic, this.props.options)
  },
  render() {

    return (
      <div>
        <this.SubscribedChild {...this.props} {...this.state} />
      </div>
    )

  }
});

export default TopicSubscriber
