import React from 'react';

import { connect } from 'react-redux';
import _ from 'lodash';


export function publishes(Component, topic, options = {}) {
  const defaults = { acknowledge: true, disclose_me: true, exclude_me: false };
  const optionsWithDefaults = Object.assign(defaults, {}, options);


  const mapStateToProps = (state) => ({
    Autobahn: state.wamp.Autobahn,
  });

  const mapDispatchToProps = () => ({
  });

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
      return this.props.Autobahn.publish(resolvedTopic, args, kwargs, optionsWithDefaults)
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
    Autobahn: React.PropTypes.object,
    onPublished: React.PropTypes.func,
    onPublishedError: React.PropTypes.func,
  };

  return connect(mapStateToProps, mapDispatchToProps)(Publisher);
}

export default publishes;
