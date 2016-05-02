import React from 'react'

import { connect } from 'react-redux'


export function wamp(Component, options = {}) {
  const defaults =  {
    url: 'ws://localhost:8080/ws',
    realm: 'realm1',
    prefixes: {}
  };
  options = Object.assign(defaults, {}, options);

  const mapStateToProps = (state, ownProps) => {
    return {
      Autobahn: state.wamp.Autobahn
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
  }

  const WampContainer = React.createClass({
    getInitialState() {
      return {
        connected: false
      }
    },
    componentWillMount() {
      // Callback called whenever the connection is lost
      this.props.Autobahn.Connection.onLost((details) => {
        console.log("Connection lost :/!");
        this.setState({connected: false})
      });
      // Callback called whenever the connection is ready
      this.props.Autobahn.Connection.onReady(([session, details]) => {
        console.log("Connection established!");
        Object.keys(options.prefixes).forEach((key) => {
          const value = options.prefixes[key]
          console.log("added prefix: ", key, value)
          session.prefix(key, value)
          this.setState({connected: true})
        })
      });
      this.props.Autobahn.Connection.initialize(options.url, options.realm)
      if (options.username) {
        this.props.Autobahn.Auth.logIn({
          username: options.username,
          password: options.password
        }).then(([session, details]) => {
          console.log('authd')
          if (this.props.onReady) {
            this.props.onReady()
          }
        }).catch((err) => {
          console.log(err);
          console.log('not authd')
        });

      }
      
    },
    render() {
      if (!this.state.connected) {
        return (<div>Connecting...</div>)
      }
      return <Component {...this.props} {...this.state} />;
    }

  });
  return connect(mapStateToProps, mapDispatchToProps)(WampContainer)

}

export default wamp
