var socket = io();

var messages = document.getElementById('messages');
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
  //var item = document.createElement('div');
  //var item2 = document.createElement('h1');
  //item2.textContent = 'test';
  //item.appendChild(item2);
  messages.appendChild(msg);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('typing', function() {
  let type = document.getElementById("typeMessage");
      type.style.visibility = "visible";
      type.style.opacity = 1;
});

socket.on('hidebox', function() {
  let type = document.getElementById("typeMessage");
      type.style.visibility = "hidden";
      type.style.opacity = 0;
});