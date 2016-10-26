import React from 'react';

import _ from 'lodash';
import AutobahnReact from '../../autobahn';


/**
 * @function publishes
 * @memberof Simpl.decorators.pubsub
 */
export function publishes(Component, topic, options = {}) {
  const defaults = { acknowledge: true, disclose_me: true, exclude_me: false };
  const optionsWithDefaults = Object.assign(defaults, {}, options);


  class Publisher extends React.Component {
    constructor(props) {
      super(props);
      this.publish = this.publish.bind(this);
    }
    publish(payload) {
      const args = payload.args || [];
      const kwargs = payload.kwargs || {};
      let resolvedTopic = topic;

      if (_.isFunction(topic)) {
        resolvedTopic = topic.bind(this)(this.props);
      }
      return AutobahnReact.publish(resolvedTopic, args, kwargs, optionsWithDefaults)
      .then(publication => {
        if (this.props.onPublished) {
          return this.props.onPublished(
            resolvedTopic, args, kwargs, optionsWithDefaults, publication
          );
        }
        return publication;
      })
      .catch(error => {
        if (this.props.onPublishedError) {
          return this.props.onPublishedError(
            resolvedTopic, args, kwargs, optionsWithDefaults, error
          );
        }
        return error;
      });
    }
    render() {
      return <Component {...this.props} {...this.state} publish={this.publish} />;
    }
  }

  Publisher.propTypes = {
    onPublished: React.PropTypes.func,
    onPublishedError: React.PropTypes.func,
  };

  return Publisher;
}

export default publishes;
