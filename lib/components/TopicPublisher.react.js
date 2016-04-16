import React from 'react'

import { publishes } from '../decorators/pubsub'


const TopicPublisher = React.createClass({
  propTypes: {
    topic: React.PropTypes.string.isRequired,
    options: React.PropTypes.object,
  },
  componentWillMount() {
    const Child = React.Children.only(this.props.children).type
    this.Publisher = publishes(Child, this.props.topic, this.props.options)
  },
  render() {

    return (
      <div>
        <this.Publisher {...this.props} {...this.state} />
      </div>
    )

  }
});

export default TopicPublisher
