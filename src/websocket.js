
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

const broadcast = (pollData) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(pollData));
    }
  });
};

module.exports = { wss, broadcast };
