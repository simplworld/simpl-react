/**
 * A constant describing all the possible connection status.
 *
 * @readonly
 * @property {string} CONNECTING='connecting' The initial value. The app is not connected to
 * the WAMP Router, yet.
 * @property {string} CONNECTED='connected' The app is connected and authenticated, but it
 * still needs to download data.
 * @property {string} LOADED='loaded' The app has downloaded all the relevant data.
 * @property {string} OFFLINE='offline' The connection was dropped.
 */
export const CONNECTION_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  LOADED: 'loaded',
  OFFLINE: 'offline',
};
