const express = require("express");

const app = express();
const http = require("http");

const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);
const chatFunc = require("./private/chatFunctions");

const port = server.port || 5002;

app.use(express.static("public"));

app.use("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
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
    socket.on('join-room', (roomId, peerId, myNickName) => {
      socket.join(roomId);
      /*
      inVoice.push({id: peerId, nickName: myNickName})
      console.log(inVoice);
      */
    });
    socket.on('leave-room', (roomId, peerId) => {
      socket.leave(roomId);
      /*
      const index = inVoice.findIndex(x => x.id === peerId);
      inVoice.splice(index, 1);
      */
    });
    socket.on('connection-request', (roomId, peerId, nickName) => {
      socket.broadcast.to(roomId).emit('new-user-connected', peerId, nickName);
    });
    socket.on('user-left', (roomId, peerId, nickName) => {
      socket.broadcast.to(roomId).emit('user-left', peerId, nickName);
    });
    socket.on('give-nick', (roomId, nickName) => {
      socket.broadcast.to(roomId).emit('give-nick', nickName);
    });
});
  

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}`);
});
