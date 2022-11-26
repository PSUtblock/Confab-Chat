var socket = io();

      var messages = document.getElementById('chatBox');
      var form = document.getElementById('form');
      var input = document.getElementById('input');
      let tid = 0;
      
      const checkTyping = () => {
        socket.emit('hidebox');
        
      }
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
          socket.emit('chat message', input.value);
          input.value = '';
        }
      });
      
      input.addEventListener('input', function(e) {
        e.preventDefault();
        clearTimeout(tid);
        socket.emit('typing');
        tid = setTimeout(checkTyping,1000);
      });
      
      socket.on('chat message', function(msg) {
        var message = document.createElement('div');
        message.className = 'chat-message';
        message.innerHTML = msg;
        chatBox.appendChild(message);
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      socket.on('typing', function() {
        let type = document.getElementById("systemMessages");
            type.innerHTML = '<p>A user is typing...</p>';
            type.style.visibility = "visible";
            type.style.opacity = 1;
      });
      
      socket.on('hidebox', function() {
        let type = document.getElementById("systemMessages");
            type.style.visibility = "hidden";
            type.style.opacity = 0;
      });
      /*
      socket.on('join-room', (roomId, peerId) => {
        console.log(peerId);
        socket.join(roomId);
      });
      socket.on('leave-room', (roomId, peerId) => {
        socket.leave(roomId);
      });
      socket.on('user-left', (roomId, peerId) => {
        //socket.broadcast.to(roomId).emit('user-left', peerId);
        console.log(roomId);
        console.log(peerId);
        console.log(socket);
        io.to(roomId).emit('user-left', peerId);
      });
      socket.on('connection-request', (roomId, peerId) => {
        //socket.broadcast.to(roomId).emit('new-user-connected', peerId);
        io.to(roomId).emit('new-user-connected', peerId);
      });
      */