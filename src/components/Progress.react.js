import React from 'react';

import { CONNECTION_STATUS } from '../constants';


function Progress(props) {
  let text;
  if (props.connectionStatus === CONNECTION_STATUS.CONNECTING) {
    text = 'Connecting…';
  } else if (props.connectionStatus === CONNECTION_STATUS.CONNECTED) {
    text = 'Loading data…';
  } else if (props.connectionStatus === CONNECTION_STATUS.OFFLINE) {
    text = 'Connection lost. If this persist, please contact the administrator.';
  }
  return (<div>{text}</div>);
}

Progress.propTypes = {
  connectionStatus: React.PropTypes.string.isRequired,
};

export default Progress;
