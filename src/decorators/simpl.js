import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import _ from 'lodash';

import AutobahnReact from '../autobahn';

import {
  addTopic, addChild, connectedScope, disconnectedScope, getDataTree, getRunUsers,
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
 *   },
 *   loadAllScenarios: false
 *   loadRunDataOnDemand: false
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
 * @param {boolean} options.loadAllScenarios - If false, load only world scenarios and this user's Scenarios.
 * If true, load all Scenarios for the subscribed runs.
 * @param {boolean} options.loadRunDataOnDemand - If true, load runs' data on request.
 * If false, load runs' data on login.
 */
export function simpl(options) {
  return (Component) => {
    const authid = parseInt(options.authid, 10);
    const optionsWithDefaults = wampOptionsWithDefaults(options);
    if (_.isFunction(options.topics)) {
      optionsWithDefaults.topics = options.topics();
    }
    if (options.hasOwnProperty('loadAllScenarios')) {
      optionsWithDefaults.loadAllScenarios = options.loadAllScenarios;
    } else {
      optionsWithDefaults.loadAllScenarios = false;
    }
    if (options.hasOwnProperty('loadRunDataOnDemand')) {
      optionsWithDefaults.loadRunDataOnDemand = options.loadRunDataOnDemand;
    } else {
      optionsWithDefaults.loadRunDataOnDemand = false;
    }
    // console.log(`optionsWithDefaults.loadAllScenarios: ${optionsWithDefaults.loadAllScenarios}`);
    // console.log(`optionsWithDefaults.loadRunDataOnDemand: ${optionsWithDefaults.loadRunDataOnDemand}`);
    // console.log(`optionsWithDefaults.topics:`, optionsWithDefaults.topics);

    const mergeProps = (propsFromState, propsFromDispatch) => {
      return {
        ...propsFromState,
        ...propsFromDispatch,
        onLeave() {
          return propsFromDispatch.onLeaveWithTopics(propsFromState.topics);
        },
        onReceived(args, kwargs, event) {
          return propsFromDispatch.onReceivedWithTopics(args, kwargs, event, propsFromState.topics);
        },
      };
    };

    const mapStateToProps = (state) => ({
      topics: state.simpl.topics,
      connectionStatus: state.simpl.connectionStatus,
      errors: state.errors,
      progressComponent: optionsWithDefaults.progressComponent,
    });

    const mapDispatchToProps = (dispatch) => {
      return ({
        setConnectionStatus(status) {
          dispatch(setConnectionStatus(status));
        },
        onReady() {
          // console.log(`onReady::`);
          if (optionsWithDefaults.topics) {
            optionsWithDefaults.topics.forEach((topic) => {
              // console.log(`dispatching connectedScope(${topic})`);
              dispatch(connectedScope(topic));
              const excludePlayers = (options.loadRunDataOnDemand && topic.includes('run')) ? true : false;
              console.log(`dispatching getRunUsers(${topic}, ${excludePlayers})`);
              dispatch(getRunUsers(topic, excludePlayers)).then((action) => {
                if (action.error) {
                  throw new Error(`${action.payload.error}: ${action.payload.args.join('; ')}`);
                }
                const runUsers = action.payload;
                console.log(`getRunUsers(${topic}) -> runUsers:`, runUsers);
                for (let i = 0; i < runUsers.length; i++) {
                  const ru = runUsers[i];
                  const ruTopic = `model:model.runuser.${ru.data.id}`;
                  if (optionsWithDefaults.loadAllScenarios) { // single player game leaders
                    // console.log(`dispatching getRunUserScenarios(${ruTopic})`);
                    dispatch(getRunUserScenarios(ruTopic));
                    if (ru.data.user !== authid) {
                      dispatch(addTopic(ruTopic));  // subscribe to other users' runuser topics
                    }
                  } else if (ru.data.user === authid) { // only get this user's scenarios
                    // console.log(`dispatching getRunUserScenarios(${ruTopic})`);
                    dispatch(getRunUserScenarios(ruTopic));
                    break;
                  }
                }
              }).then(() => {
                // console.log(`dispatching getCurrentRunUserInfo(${authid})`);
                dispatch(getCurrentRunUserInfo(authid));
              });
              // console.log(`dispatching getCurrentRunPhase(${topic})`);
              dispatch(getCurrentRunPhase(topic));
              if (options.loadRunDataOnDemand && topic.includes('run')) {
                // console.log(`Will load run's worlds on demand.`);
                // console.log(`dispatching getDataTree(${topic}, ['world'])`);
                dispatch(getDataTree(topic, ['world']));
              } else {
                // console.log(`dispatching getDataTree(${topic})`);
                dispatch(getDataTree(topic));
              }
              // console.log(`dispatching addTopic(${topic})`);
              dispatch(addTopic(topic));
            });
          }
          // console.log(`dispatching getPhases('model:model.game')`);
          dispatch(getPhases('model:model.game'));
          // console.log(`dispatching getRoles('model:model.game')`);
          dispatch(getRoles('model:model.game'));
          return Promise.resolve();
        },
        onLeaveWithTopics(topics) {
          // invoked when navigate between pages -- sometimes
          // console.log(`onLeaveWithTopics:: topics: `, topics);
          if (topics) {
            topics.forEach((topic) => {
              dispatch(disconnectedScope(topic));
            });
          }
          return Promise.resolve();
        },
        onReceivedWithTopics(args, kwargs, event, topics) {
          // invoked on receiving topic events
          // console.log(`onReceivedWithTopics:: args: `, args, `, event: `, event, `, topics: `, topics);
          if (kwargs.error) {
            dispatch(showGenericError(args, kwargs));
          } else {
            const [pk, resourceName, data] = args;
            if (topics) {
              const resolvedTopics = topics.map(
                (topic) => AutobahnReact.Connection.currentConnection.session.resolve(topic)
              );
              resolvedTopics.forEach((topic) => {
                const actions = {
                  [`${topic}.add_child`]: addChild,
                  [`${topic}.remove_child`]: removeChild,
                  [`${topic}.update_child`]: updateScope,
                };
                if (actions[event.topic]) {
                  // console.log('dispatching: ', actions[event.topic])
                  dispatch(actions[event.topic]({ resource_name: resourceName, data, pk }));
                  if (resourceName === 'runuser' && event.topic.endsWith('update_child')) {
                    // Is the updated runuser associated with the current user?
                    if (authid === data.user) {
                      dispatch(getCurrentRunUserInfo(authid));
                    }
                  }
                }
              });
            }
          }
        },
      });
    };


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


    // eslint-disable-next-line react/no-multi-comp
    class Simpl extends React.Component {
      componentDidMount() {
        wampSetup(this, optionsWithDefaults);
        window.addEventListener('beforeunload', this.props.onLeave);
      }

      componentWillUnmount() {
        window.removeEventListener('beforeunload', this.props.onLeave);
      }

      render() {
        const appTopics = this.props.topics.reduce(
          (memo, topic) => memo.concat([
            `${topic}.add_child`,
            `${topic}.update_child`,
            `${topic}.remove_child`,
          ])
          , [
            `model:error.${options.authid}`,
          ]);
        const SubscribedAppContainer = subscribes(appTopics)(AppContainer);

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
      topics: PropTypes.array.isRequired,
      connectionStatus: PropTypes.string.isRequired,
      onLeave: PropTypes.func,
      onReady: PropTypes.func.isRequired,
      progressComponent: PropTypes.func.isRequired,
      setConnectionStatus: PropTypes.func.isRequired,
    };

    const SimplContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Simpl);

    return SimplContainer;
  };
}

/**
 * @namespace simpl
 * @memberof Simpl.decorators
 */
export default simpl;
