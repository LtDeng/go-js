const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'join') {
      // Handle join message
      ws.sessionId = data.sessionId;
    }
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        if (data.type === 'join' && client.sessionId === data.sessionId) {
          client.send(message);
        } else if (data.type !== 'join') {
          client.send(message);
        }
      }
    });
  });
});

console.log('Signaling server running on ws://localhost:8080');
