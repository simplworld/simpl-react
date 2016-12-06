import React from 'react';


function Progress(props) {
  const text = props.progress === 'offline' ? 'Connecting…' : 'Loading data…';
  return (<div>{text}</div>);
}


export default Progress;
