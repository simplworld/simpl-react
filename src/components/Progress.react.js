import React from 'react';


function Progress(props) {
  const text = props.progress === 'offline' ? 'Connecting…' : 'Loading data…';
  return (<div>{text}</div>);
}

Progress.propTypes = {
  progress: React.PropTypes.string.isRequired,
};

export default Progress;
