// Features script file
/**
 * This document contains the functions that generally add light processes to the application
 * The following have been added:
 *
 * clock - provides the user an active clock in the application providing the user the date and time
 * fullscreen - is a
 */

const doomlink =
  "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1";
const otlink =
  "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Foriginal%2F2X%2F5%2F53e616496b4da1d95136e235ad90c9cc3f3f760d.jsdos?anonymous=1";

const clock = () => {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let tod = "AM";
  let time = "";
  const month = date.getUTCMonth();
  const weekday = date.getUTCDay();
  let day = date.getUTCDate();
  const year = date.getFullYear();
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dateform = "";

  if (hours === 0) {
    hours = 12;
  }

  if (hours > 12) {
    hours -= 12;
    tod = "PM";
  }

  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (day < 10) day = `0${day}`;

  time = `${hours}:${minutes} ${tod}`;
  dateform = `${days[weekday]} ${day} ${months[month]} ${year - 24}`;

  document.getElementById("systime").innerText = time;
  document.getElementById("sysdate").innerText = dateform;
};

// these functions are used to hide and hide application windows
const unhideapp = (id) => {
  document.getElementById(id).style.visibility = "visible";
};
const hideapp = (id) => {
  document.getElementById(id).style.visibility = "hidden";
};

const unhidegame = (id) => {
  const game = document.getElementById(id);
  const gamewindow = document.createElement("iframe");
  gamewindow.width = 680;
  gamewindow.height = 400;
  gamewindow.frameborder = 0;
  if (id === "doom") gamewindow.src = doomlink;
  gamewindow.id = "doomgame";
  if (id === "ot") gamewindow.src = otlink;
  gamewindow.id = "otgame";
  gamewindow.setAttribute("allowFullScreen", "");
  game.append(gamewindow);
  game.style.visibility = "visible";
};

const hidegame = (id) => {
  const game = document.getElementById(id);
  game.style.visibility = "hidden";
  if (id == "doom") document.getElementById("doomgame").remove();
  if (id == "ot") document.getElementById("otgame").remove();
};

// These listeners hide and unhide the applications
document.getElementById("chatApp").addEventListener("dblclick", () => {
  unhideapp("chat");
});
document.getElementById("closechat").addEventListener("click", () => {
  hideapp("chat");
});
document.getElementById("voiceApp").addEventListener("dblclick", () => {
  unhideapp("voice");
  unhideapp('systemMessagesChat');
});
document.getElementById("closeVoice").addEventListener("click", () => {
  hideapp('voice');
  hideapp('systemMessagesChat');
});
document.getElementById("usersApp").addEventListener("dblclick", () => {
  unhideapp("users");
});
document.getElementById("closeusers").addEventListener("click", () => {
  hideapp("users");
});
document.getElementById("doomApp").addEventListener("dblclick", () => {
  unhidegame("doom");
});
document.getElementById("closedoom").addEventListener("click", () => {
  hidegame("doom");
});
document.getElementById("otApp").addEventListener("dblclick", () => {
  unhidegame("ot");
});
document.getElementById("closeot").addEventListener("click", () => {
  hidegame("ot");
});

// Calls and sets the clock
setInterval(clock, 1000);
