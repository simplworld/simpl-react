import React from 'react';

import { connect } from 'react-redux';
import { stopSubmit } from 'redux-form';
import {
  addChild, connectedScope, disconnectedScope, getDataTree, getRunUsers,
  removeChild, updateScope, getCurrentRunPhase, getPhases, getRoles,
  // eslint-disable-next-line comma-dangle
  showGenericError
} from '../actions/simpl';

import Progress from '../components/Progress.react';

import { subscribes } from './pubsub/subscribes';
import { wamp } from './wamp';
import _ from 'lodash';
import AutobahnReact from '../autobahn';

/**
 * Decorator to wrap your main app
 * @example
 * export default simpl({
 *   username: 'username',
 *   password: 'password',
 *   url: 'ws://example.com/ws',
 *   progressComponent: MyProgressComponent,
 *   topics: () => ['topic1', 'topic2'],
 *   prefixes: {
 *     model: 'org.example.namespace'
 *   }
 * })(MyComponent);

 * @function
 * @memberof Simpl.decorators
 * @param {Object} options - An object of options.
 * @param {string} options.username - The username for authenticating on the WAMP Router.
 * @param {string} options.password - The password for authenticating on the WAMP Router.
 * @param {string} options.url - The URL of the WAMP router.
 * @param {function} [options.progressComponent] - A customized Component to show
 * the App's connection state. The component will receive a `progress` prop which
 * can have one of the following values:
 * * `offline`: The initial value. The app is not connected to the WAMP Router, yet.
 * * `connected`: The app is connected and authenticated, but it still needs to download data.
 * * `loaded`: The app has downloaded all the relevant data.
 * @param {function} options.topics - A function return a list of topic to subsribe to.
 * @param {Object} [options.prefixes] - An object mapping names to topic prefixes,
 * to be used as shortcuts.
 */
export function simpl(options) {
  return (Component) => {
    const optionsWithDefaults = Object.assign({}, {
      progressComponent: Progress,
    }, options);
    if (_.isFunction(options.topics)) {
      optionsWithDefaults.topics = options.topics();
    }

    const mapStateToProps = (state, ownProps) => ({
      progress: state.simpl.loaded === true ? 'loaded' : ownProps.progress,
      errors: state.errors,
      progressComponent: optionsWithDefaults.progressComponent,
    });

    const mapDispatchToProps = (dispatch) => ({
      onReady() {
        if (optionsWithDefaults.topics) {
          optionsWithDefaults.topics.forEach((topic) => {
            dispatch(connectedScope(topic));
            dispatch(getRunUsers(topic));
            dispatch(getCurrentRunPhase(topic));
            dispatch(getDataTree(topic));
          });
        }
        dispatch(getPhases('model:model.game'));
        dispatch(getRoles('model:model.game'));
        return Promise.resolve();
      },
      onLeave() {
        if (optionsWithDefaults.topics) {
          optionsWithDefaults.topics.forEach((topic) => {
            dispatch(disconnectedScope(topic));
          });
        }
        return Promise.resolve();
      },
      onReceived(args, kwargs, event) {
        if (kwargs.error) {
          if (kwargs.error === 'application.error.validation_error') {
            const [form, errors] = args;
            dispatch(stopSubmit(form, errors));
          } else {
            dispatch(showGenericError(args, kwargs));
          }
        } else {
          const [pk, resourceName, data] = args;
          const resolvedTopics = optionsWithDefaults.topics.map(
            (topic) => AutobahnReact.Connection.currentConnection.session.resolve(topic)
          );
          resolvedTopics.forEach((topic) => {
            const actions = {
              [`${topic}.add_child`]: addChild,
              [`${topic}.remove_child`]: removeChild,
              [`${topic}.update_child`]: updateScope,
            };
            if (actions[event.topic]) {
              dispatch(actions[event.topic]({ resource_name: resourceName, data, pk }));
            }
          });
        }
      },
    });


    class AppContainer extends React.Component {

      shouldComponentUpdate(nextProps, nextState) {
        if (this.props.progress === 'loaded') {
          return false;
        }
        return this.props !== nextProps || this.state !== nextState;
      }
      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    AppContainer.propTypes = {
      progress: React.PropTypes.string.isRequired,
    };


    const appTopics = optionsWithDefaults.topics.reduce(
      (memo, topic) => memo.concat([
        `${topic}.add_child`,
        `${topic}.update_child`,
        `${topic}.remove_child`,
      ])
    , [
      `model:error.${options.username}`,
    ]);
    const SubscribedAppContainer = subscribes(appTopics)(AppContainer);

    // eslint-disable-next-line react/no-multi-comp
    class Simpl extends React.Component {
      componentWillMount() {
        this.props.onReady();
        window.addEventListener('beforeunload', this.props.onLeave);
      }
      componentWillUnmount() {
        window.removeEventListener('beforeunload', this.props.onLeave);
      }
      render() {
        if (this.props.progress !== 'loaded') {
          return (
            <div className={`simpl simpl-${this.props.progress}`}>
              <this.props.progressComponent {...this.props} {...this.state} />
            </div>
            );
        }
        return (
          <div className={`simpl simpl-${this.props.progress}`}>
            <SubscribedAppContainer {...this.props} {...this.state} />
          </div>
        );
      }
    }

    Simpl.propTypes = {
      progress: React.PropTypes.string.isRequired,
      onLeave: React.PropTypes.func,
      onReady: React.PropTypes.func.isRequired,
      progressComponent: React.PropTypes.func.isRequired,
    };

    const SimplContainer = connect(mapStateToProps, mapDispatchToProps)(Simpl);
    const WampContainer = wamp(optionsWithDefaults)(SimplContainer);

    return WampContainer;
  };
}

/**
 * @namespace simpl
 * @memberof Simpl.decorators
 */
export default simpl;
