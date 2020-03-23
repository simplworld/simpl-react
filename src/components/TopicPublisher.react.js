import React from 'react';
import PropTypes from 'prop-types';

import { publishes } from '../decorators/pubsub/publishes';


/**
 * @class TopicPublisher
 * @extends {React.Component}
 * @memberof Simpl.components
 */
class TopicPublisher extends React.Component {
  componentDidMount() {
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
  topic: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,
  options: PropTypes.object,
};

export default TopicPublisher;
