import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';

const SIGNALR_URL = 'http://localhost:5255/hubs/tasks';

let connection = null;
let startPromise = null;
let stopRequested = false;

export const startSignalRConnection = async () => {
  stopRequested = false;

  // Already connected.
  if (
    connection &&
    connection.state === HubConnectionState.Connected
  ) {
    return connection;
  }

  // Already starting.
  if (startPromise) {
    return startPromise;
  }

  // Create connection only when one doesn't exist.
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(SIGNALR_URL, {
        accessTokenFactory: () =>
          localStorage.getItem('taskify_token') || '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connection.onreconnecting((error) => {
      // Keep error logging
      console.error('SignalR reconnecting error:', error);
    });

    connection.onreconnected((connectionId) => {
      // Silent reconnection
    });

    connection.onclose((error) => {
      // Keep error logging
      console.error('SignalR connection closed Unexpectedly:', error);
    });
  }

  startPromise = (async () => {
    try {
      await connection.start();

      // If a stop was requested while the connection
      // was starting, immediately stop it instead of
      // leaving a connection that AuthContext no longer wants.
      if (stopRequested) {
        await connection.stop();
        connection = null;
        return null;
      }

      return connection;
    } catch (error) {
      console.error(
        'SignalR connection failed:',
        error
      );

      connection = null;

      throw error;
    } finally {
      startPromise = null;
    }
  })();

  return startPromise;
};

export const stopSignalRConnection = async () => {
  // Tell an in-progress startup that it should not
  // remain connected.
  stopRequested = true;

  // If startup is currently happening, wait for it.
  if (startPromise) {
    try {
      await startPromise;
    } catch {
      // Startup failure is already logged by startSignalRConnection.
    }
  }

  if (!connection) {
    return;
  }

  try {
    if (
      connection.state !== HubConnectionState.Disconnected
    ) {
      await connection.stop();
    }
  } catch (error) {
    console.error(
      'Failed to disconnect SignalR:',
      error
    );
  } finally {
    connection = null;
  }
};

export const getSignalRConnection = () => {
  return connection;
};