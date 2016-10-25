import React from 'react';

import { publishes } from '../decorators/pubsub/publishes';


/**
 * @class TopicPublisher
 * @memberof Simpl.components
 */
class TopicPublisher extends React.Component {
  componentWillMount() {
    // eslint-disable-next-line react/prop-types
    const Child = React.Children.only(this.props.children).type;
    this.Publisher = publishes(Child, this.props.topic, this.props.options);
  }
  componentWillUpdate(nextProps) {
    const Child = React.Children.only(nextProps.children).type;
    this.Publisher = publishes(Child, nextProps.topic, nextProps.options);
  }
  render() {
    return (
      <div>
        <this.Publisher {...this.props} {...this.state} />
      </div>
    );
  }
}

TopicPublisher.propTypes = {
  topic: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.func,
  ]).isRequired,
  options: React.PropTypes.object,
};

export default TopicPublisher;
