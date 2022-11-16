const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const chatFunc = require('./private/chatTemplates/chatFunctions' )

const port = process.env.PORT || 5002;

app.use('/', (req, res) => {
  res.sendFile("index.html",{"root":"public"});
});

io.on('connection', (socket) => {

    socket.on('chat message', (msg) => {
      io.emit('chat message', chatFunc.parseMessage(msg));
      console.log('message: ' + msg);
    });
    
    socket.on('typing', ()  => {
        io.emit('typing');
    });

    socket.on('hidebox', () => {
        io.emit('hidebox');
    });
  });

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}`);
});