const socket = io();

const messages = document.getElementById("chatBox");
const form = document.getElementById("form");
const input = document.getElementById("chatinput");
let tid = 0;

// Values Created for voice chat
// const socket = io();
const peer = new Peer();
// Voice Chat Div
const voiceApp = document.getElementById("voiceApp");
// Names of users in Chat
const audioGrid = document.getElementById("inVoice");
// Clients audio
const myAudio = document.createElement("audio");
// Sound to play on user join
const joinSound = document.getElementById("onJoin");
// Room Id to connect to
const roomToConnect = "voice-chat";
// Clients Nick name
let myNickName = "";
// Users in voice Chat nicknames
let thierName = [];
// Mute clients audio
myAudio.muted = true;

// List of calls used to end calls between users
const peers = {};

const connectsound = new Audio("../sounds/Connecting.mp3");

const checkUsers = () => {
  socket.emit("userlist", myNickName);
};
const checkTyping = () => {
  socket.emit("hidebox");
};

// checks for new users every second
setInterval(checkUsers, 1000);

// on an unload send the name so it can be removed from the list of users
window.addEventListener("beforeunload", (e) => {
  e.preventDefault();
  window.alert("Leaving Site");
  socket.emit("removeuser", myNickName);
});

socket.on("userlist", (users) => {
  document.getElementById("userslist").innerHTML = users;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", `${myNickName}: ${input.value}`);
    input.value = "";
  }
});

input.addEventListener("input", (e) => {
  e.preventDefault();
  clearTimeout(tid);
  socket.emit("typing");
  tid = setTimeout(checkTyping, 1000);
});

socket.on("chat message", (msg) => {
  const message = document.createElement("div");
  message.className = "chat-message";
  message.innerHTML = msg;
  messages.insertBefore(message, messages.firstChild);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("typing", () => {
  const type = document.getElementById("systemMessages");
  type.innerHTML = "<p>A user is typing...</p>";
  type.style.visibility = "visible";
  type.style.opacity = 1;
});

socket.on("hidebox", () => {
  const type = document.getElementById("systemMessages");
  type.style.visibility = "hidden";
  type.style.opacity = 0;
});

// Functions By Storm for the voice options.

// Pop up to get user nick name
window.addEventListener("load", () => {
  setTimeout((event) => {
    document.querySelector(".popup").style.display = "block";
  }, 50);
});
// Close pop up event
document.querySelector("#close").addEventListener("click", () => {
  document.querySelector(".popup").style.display = "none";
  myNickName = document.getElementById("userName").value;
  connectsound.play();
  document.getElementById("splash").remove();
});

// Join Room function
// Puts client in room and alerts other users in voice of new user
// Uses in room call the person joining
const joinRoom = () => {
  const getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  // Puts client in room
  socket.emit("join-room", roomToConnect, peer.id, myNickName);

  voiceApp.style.display = "block";

  // Gets client audio
  getUserMedia({ video: false, audio: true }, (mediaStream) => {
    myStream = mediaStream;
    let count = -1;
    addAudioStream(myAudio, myNickName, "myAudio", mediaStream);
    // When user recives a call
    peer.off("call").on("call", (call, userId) => {
      console.log(thierName);
      call.answer(mediaStream);
      peers[call.peer] = call;
      const audio = document.createElement("audio");
      console.log(count);
      audio.setAttribute("id", call.peer);
      call.on("stream", (userAudioStream) => {
        count += 1;
        console.log(thierName[count]);
        addAudioStream(audio, thierName[count], call.peer, userAudioStream);
      });
    });
    // Calls connectNewUser Function and alerts users in room of new user
    socket
      .off("new-user-connected")
      .on("new-user-connected", (userId, nickName) => {
        const type = document.querySelectorAll("#systemMessagesChat");
        console.log(type);
        type[0].innerHTML = `<marquee>User ${nickName} joined</marquee>`;
        type[0].style.visibility = "visible";
        type[0].style.opacity = 1;
        console.log(joinSound);
        joinSound.play();
        socket.emit("added-to-voice", peer.id);
        console.log(`New user: ${userId}`);
        setTimeout(connectNewUser, 1000, userId, nickName, mediaStream);
      });
    // Alerting everyone else in the room of new user
    socket.emit("connection-request", roomToConnect, peer.id, myNickName);

    peer.on("error", (err) => console.log(err));
  });
};

// Function to leave voice chat room
// Removes client from room and lets other users know of user leaving
const leaveRoom = () => {
  thierName = [];
  // Leaves Room
  socket.emit("leave-room", roomToConnect);
  // Alert other users to who left
  socket.emit("user-left", roomToConnect, peer.id, myNickName);

  /*
    const tracks = myStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    */
  // Removes audi divs from html
  removeUnusedDivs();
  myAudio.muted = true;
  myAudio.srcObject = null;
};

// Sets thierName to users currently in room
socket.on("give-nick", (nickName) => {
  thierName.push(nickName);
});

// Alerts other users of user leaving
socket.on("user-left", (userId, nickName) => {
  const type = document.querySelectorAll("#systemMessagesChat");
  console.log(type);
  type[0].innerHTML = `<marquee>User ${nickName} left</marquee>`;
  type[0].style.visibility = "visible";
  type[0].style.opacity = 1;
  const toRemove = document.getElementById(userId);
  toRemove.remove();
  if (peers[userId]) {
    console.log(peers[userId]);
    peers[userId].close();
  }
});

// Connects to a new user
// Calls user joining room
// Adds call object to peers
const connectNewUser = (userId, nickName, stream) => {
  socket.emit("give-nick", roomToConnect, myNickName);
  const call = peer.call(userId, stream);
  const audio = document.createElement("audio");
  audio.setAttribute("id", userId);
  call.on("stream", (userAudioStream) => {
    addAudioStream(audio, nickName, userId, userAudioStream);
  });
  call.on("close", () => {
    console.log(call.peer);
    toRemove = document.getElementById(call.peer);
    if (toRemove) toRemove.remove();
  });
  peers[userId] = call;
  console.log(peers);
};

// Adds audio, nickname, and mute button to DOM
const addAudioStream = (audio, nickName, id, stream) => {
  const div = document.createElement("div");
  const name = document.createElement("h1");
  div.className = "inVoice";
  div.setAttribute("id", id);
  name.setAttribute("id", "userInVoice");
  name.textContent = nickName;
  audio.srcObject = stream;
  console.log(audio);
  console.log(nickName);
  audio.addEventListener("loadedmetadata", () => {
    audio.play();
  });
  div.append(name);
  if (nickName != myNickName) {
    div.append(addMuteButton());
  }
  div.append(audio);
  audioGrid.appendChild(div);
};

// Removes audio divs when a user leaves the chat
const removeUnusedDivs = () => {
  alldivs = audioGrid.getElementsByTagName("div");
  while (audioGrid.hasChildNodes) {
    audioGrid.removeChild(audioGrid.firstChild);
  }
};

// Function to mute clients audio
const muteMyAudio = () => {
  const audi = myStream.getAudioTracks();
  audi[0].enabled = !audi[0].enabled;
  const mydiv = document.getElementById("myAudio");
  const myName = mydiv.querySelector("h1");
  console.log(audi.enabled);
  if (audi[0].enabled) myName.style.color = "black";
  else myName.style.color = "red";
};

// Mutes other users audio on button click
const muteThierAudio = (e) => {
  const div = e.target.parentElement;
  const toMute = div.querySelector("audio");
  const toChange = div.querySelector("h1");
  toMute.muted = !toMute.muted;
  if (toMute.muted) toChange.style.color = "red";
  else toChange.style.color = "black";
};

// Adds mute button to audio grid for each user in chat
const addMuteButton = () => {
  const but = document.createElement("button");
  but.setAttribute("type", "button");
  but.textContent = "Mute";
  but.addEventListener("click", muteThierAudio);
  return but;
};
