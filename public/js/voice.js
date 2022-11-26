//const socket = io();
const peer = new Peer();

const voiceApp = document.getElementById('voiceApp');
const audioGrid = document.getElementById("inVoice");
const myAudio = document.createElement("audio");
const joinSound = document.getElementById('onJoin')
const roomToConnect = 'voice-chat';
let myNickName = '';
let thierName = [];
myAudio.muted = true;


let peers = {};

window.addEventListener("load", function () {
  setTimeout(function open(event) {
    document.querySelector(".popup").style.display = "block";
  }, 1000);
});

document.querySelector("#close").addEventListener("click", function () {
  document.querySelector(".popup").style.display = "none";
  myNickName = document.getElementById("userName").value;
  //socket.emit("new user", nickName, peerId);
});

const joinRoom = () => {
  let getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  socket.emit("join-room", roomToConnect, peer.id, myNickName);

  voiceApp.style.display = 'block';

  getUserMedia({ video: false, audio: true }, (mediaStream) => {
    myStream = mediaStream;
    let count = -1;
    addAudioStream(myAudio, myNickName, 'myAudio', mediaStream);
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
    socket.off("new-user-connected").on("new-user-connected", (userId, nickName) => {
      let type = document.querySelectorAll("#systemMessages");
      console.log(type);
      type[1].innerHTML = `<marquee>User ${nickName} joined</marquee>`;
      type[1].style.visibility = "visible";
      type[1].style.opacity = 1;
      console.log(joinSound);
      joinSound.play();
      socket.emit("added-to-voice", peer.id);
      console.log("New user: " + userId);
      setTimeout(connectNewUser, 1000, userId, nickName, mediaStream);
    });
    socket.emit("connection-request", roomToConnect, peer.id, myNickName);

    peer.on("error", (err) => console.log(err));
  });
};

const leaveRoom = () => {
  voiceApp.style.display = 'none' 
  thierName = [];
  socket.emit("leave-room", roomToConnect);
  socket.emit("user-left", roomToConnect, peer.id, myNickName);

  /*
    const tracks = myStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    */
  removeUnusedDivs();
  myAudio.srcObject = null;
};


socket.on('give-nick', (nickName) => {thierName.push(nickName)});

socket.on('user-left', (userId, nickName) => {
  let type = document.querySelectorAll("#systemMessages");
  console.log(type);
  type[1].innerHTML = `<marquee>User ${nickName} left</marquee>`;
  type[1].style.visibility = "visible";
  type[1].style.opacity = 1;
  const toRemove = document.getElementById(userId);
  toRemove.remove();
  if (peers[userId]){
    console.log(peers[userId]);
    peers[userId].close();
  } 
});

const connectNewUser = (userId, nickName, stream) => {
  socket.emit('give-nick', roomToConnect, myNickName)
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

const addAudioStream = (audio, nickName, id, stream) => {
  //const li = document.createElement('li');
  const div = document.createElement('div');
  const name = document.createElement('h1');
  div.className = 'inVoice';
  div.setAttribute('id', id);
  name.setAttribute('id', 'userInVoice');
  name.textContent = nickName
  audio.srcObject = stream;
  console.log(audio);
  console.log(nickName);
  audio.addEventListener("loadedmetadata", () => {
    audio.play();
  });
  div.append(name);
  if(nickName != myNickName){
   div.append(addMuteButton());
  }
  div.append(audio)
  audioGrid.appendChild(div);
};

const removeUnusedDivs = () => {
  alldivs = audioGrid.getElementsByTagName("div"); // Get all divs in our video area
  while (audioGrid.hasChildNodes) {
    audioGrid.removeChild(audioGrid.firstChild);
  }
};

const muteMyAudio = () => {
  const audi = myStream.getAudioTracks();
  audi[0].enabled = !audi[0].enabled;
}

const muteThierAudio = (e) => {
  const div = e.target.parentElement;
  const toMute = div.querySelector('audio');
  toMute.muted = !toMute.muted
}


const addMuteButton = () => {
  const but = document.createElement('button');
  but.textContent = 'Mute';
  but.addEventListener('click', muteThierAudio);
  return but;
}




