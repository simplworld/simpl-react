import React from 'react';
import PropTypes from 'prop-types';

import { subscribes } from '../decorators/pubsub/subscribes';


/**
 * @class TopicSubscriber
 * @extends {React.Component}
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
  topic: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,
  options: PropTypes.object,
};


export default TopicSubscriber;
