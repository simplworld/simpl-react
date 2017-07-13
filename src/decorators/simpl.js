import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { stopSubmit } from 'redux-form';

import _ from 'lodash';

import AutobahnReact from '../autobahn';

import {
  addChild, connectedScope, disconnectedScope, getDataTree, getRunUsers,
  removeChild, updateScope, getCurrentRunPhase, getPhases, getRoles, getCurrentRunUserInfo,
  // eslint-disable-next-line comma-dangle
  getRunUserScenarios, showGenericError, setConnectionStatus
} from '../actions/simpl';
import { CONNECTION_STATUS } from '../constants';

import { subscribes } from './pubsub/subscribes';
import { wampOptionsWithDefaults, wampSetup } from './utils';


/**
 * Decorator to wrap your main app
 * @example
 * export default simpl({
 *   authid: 123,
 *   password: 'password',
 *   url: 'ws://example.com/ws',
 *   progressComponent: MyProgressComponent,
 *   topics: () => ['topic1', 'topic2'],
 *   root_topic: 'org.example.namespace',
 *   prefixes: {
 *     special: 'org.example.namespace.special.shortcut'
 *   }
 * })(MyComponent);

 * @function
 * @memberof Simpl.decorators
 * @param {Object} options - An object of options.
 * @param {string} options.authid - The user id for authenticating on the WAMP
 * Router. This will the user's id on Simpl-Games-Api
 * @param {string} options.password - The password for authenticating on the
 * WAMP Router.
 * @param {string} options.url - The URL of the WAMP router.
 * @param {function} [options.progressComponent] - A customized Component to
 * show the App's connection state. The component will receive a
 * `connectionStatus` prop which can have one of the following values:
 * * `connecting`: The initial value. The app is not connected to the WAMP Router, yet.
 * * `connected`: The app is connected and authenticated, but it still needs to download data.
 * * `loaded`: The app has downloaded all the relevant data.
 * * `offline`:  The connection was dropped.
 * @param {function} options.topics - A function returning a list of topics to
 * subscribe to.
 * @param {string} options.root_topic - The root topic for your model. This will
 * be used for the `'model'` prefix.
 * @param {Object} [options.prefixes] - An object mapping names to topic
 * prefixes, to be used as shortcuts.
 */
export function simpl(options) {
  return (Component) => {
    const optionsWithDefaults = wampOptionsWithDefaults(options);
    if (_.isFunction(options.topics)) {
      optionsWithDefaults.topics = options.topics();
    }

    const mapStateToProps = (state) => ({
      connectionStatus: state.simpl.connectionStatus,
      errors: state.errors,
      progressComponent: optionsWithDefaults.progressComponent,
    });

    const mapDispatchToProps = (dispatch) => ({
      setConnectionStatus(status) {
        dispatch(setConnectionStatus(status));
      },
      onReady() {
        if (optionsWithDefaults.topics) {
          const authid = parseInt(options.authid, 10);
          optionsWithDefaults.topics.forEach((topic) => {
            console.log("onReady: topic=", topic);
            dispatch(connectedScope(topic));
            dispatch(
              getRunUsers(topic)
            ).then((action) => {
              const runUsers = action.payload;
              runUsers.forEach((ru) => {
                if (ru.data.user === authid || ru.data.leader === true) {  // if leader, also get player scenarios
                  dispatch(getRunUserScenarios(`model:model.runuser.${ru.data.id}`));
                }
              });
            }).then(() => {
              dispatch(getCurrentRunUserInfo(authid));
            });
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
        if (this.props.connectionStatus === CONNECTION_STATUS.LOADED) {
          return false;
        }
        return this.props !== nextProps || this.state !== nextState;
      }
      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    AppContainer.propTypes = {
      connectionStatus: PropTypes.string.isRequired,
    };


    const appTopics = optionsWithDefaults.topics.reduce(
      (memo, topic) => memo.concat([
        `${topic}.add_child`,
        `${topic}.update_child`,
        `${topic}.remove_child`,
      ])
    , [
      `model:error.${options.authid}`,
    ]);
    const SubscribedAppContainer = subscribes(appTopics)(AppContainer);

    // eslint-disable-next-line react/no-multi-comp
    class Simpl extends React.Component {
      componentWillMount() {
        wampSetup(this, optionsWithDefaults);
        window.addEventListener('beforeunload', this.props.onLeave);
      }
      componentWillUnmount() {
        window.removeEventListener('beforeunload', this.props.onLeave);
      }
      render() {
        if (this.props.connectionStatus !== CONNECTION_STATUS.LOADED) {
          return (
            <div className={`simpl simpl-${this.props.connectionStatus}`}>
              <this.props.progressComponent {...this.props} {...this.state} />
            </div>
            );
        }
        return (
          <div className={`simpl simpl-${this.props.connectionStatus}`}>
            <SubscribedAppContainer {...this.props} {...this.state} />
          </div>
        );
      }
    }

    Simpl.propTypes = {
      connectionStatus: PropTypes.string.isRequired,
      onLeave: PropTypes.func,
      onReady: PropTypes.func.isRequired,
      progressComponent: PropTypes.func.isRequired,
      setConnectionStatus: PropTypes.func.isRequired,
    };

    const SimplContainer = connect(mapStateToProps, mapDispatchToProps)(Simpl);

    return SimplContainer;
  };
}

/**
 * @namespace simpl
 * @memberof Simpl.decorators
 */
export default simpl;
