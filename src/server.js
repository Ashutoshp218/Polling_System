const express = require('express');
const http = require('http');
const { wss } = require('./websocket');
const startConsumer = require('./consumers');
const pollRoutes = require('./routes/pollRoutes');

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));
app.use(express.json());
app.use('/api', pollRoutes);

// WebSocket upgrade
server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

// Start Kafka Consumer
startConsumer();

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
