import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { setConnectionStatus } from '../actions/simpl';
import { CONNECTION_STATUS } from '../constants';

import { wampOptionsWithDefaults, wampSetup } from './utils';

/**
 * @function
 * @memberof Simpl.decorators
 */
export function wamp(options = {}) {
  return (Component) => {
    const optionsWithDefaults = wampOptionsWithDefaults(options);

    class Wamp extends React.Component {
      componentWillMount() {
        wampSetup(this, optionsWithDefaults);
      }
      render() {
        if (this.props.connectionStatus === CONNECTION_STATUS.CONNECTING) {
          return (
            <div className={`wamp wamp-${this.props.connectionStatus}`}>
              <optionsWithDefaults.progressComponent {...this.props} />
            </div>
          );
        }
        return (
          <div className={`wamp wamp-${this.props.connectionStatus}`}>
            <Component {...this.props} />
          </div>
        );
      }
    }

    Wamp.propTypes = {
      onReady: PropTypes.func,
      connectionStatus: PropTypes.string.isRequired,
      setConnectionStatus: PropTypes.func.isRequired,
    };

    const mapStateToProps = (state) => ({
      connectionStatus: state.simpl.connectionStatus,
    });

    const mapDispatchToProps = (dispatch) => ({
      setConnectionStatus(status) {
        dispatch(setConnectionStatus(status));
      },
    });

    return connect(mapStateToProps, mapDispatchToProps)(Wamp);
  };
}

export default wamp;
