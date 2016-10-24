import React from 'react';

import { subscribes } from '../decorators/pubsub/subscribes';


/**
 * @class TopicSubscriber
 * @memberof Simpl.components
 */
class TopicSubscriber extends React.Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const Child = React.Children.only(this.props.children).type;
    const SubscribedChild = subscribes(Child, this.props.topic, this.props.options);

    return (
      <div>
        <SubscribedChild {...this.props} {...this.state} />
      </div>
    );
  }
}

TopicSubscriber.propTypes = {
  topic: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.func,
  ]).isRequired,
  options: React.PropTypes.object,
};


export default TopicSubscriber;
