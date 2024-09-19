import React, { useRef, useState, useEffect } from 'react';
import Chat from './Chat';
import { ConnectionConsumer, ChannelConsumer } from './App';

const Container = () => {
  const [socketMessages, setSocketMessages] = useState([]);
  const webSocket = useRef(null);

  useEffect(() => {
    webSocket.current = new WebSocket(
      process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:9000'
    );
    webSocket.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setSocketMessages((prev) => [...prev, data]);
    };
    webSocket.current.onclose = () => {
      webSocket.current.close();
    };
    return () => {
      if (webSocket.current.readyState === 1) {
        webSocket.current.close();
      }
    };
  }, []);

  return (
    <ConnectionConsumer>
      {({ connection, updateConnection }) => (
        <ChannelConsumer>
          {({ channel, updateChannel }) => (
            <Chat
              connection={connection}
              updateConnection={updateConnection}
              channel={channel}
              updateChannel={updateChannel}
              socketMessages={socketMessages}
              onSend={(message) => webSocket.current.send(message)}
            />
          )}
        </ChannelConsumer>
      )}
    </ConnectionConsumer>
  );
};

export default Container;
