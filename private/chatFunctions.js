// Travis Block
// ChatSlash
/** The functions in this file will as as commands that users can type in their messages
 * to perform various functions like making links, image links, help commands etc..
 *
 * At this time or the time of submitance, The function only sanitizes the user input to prevent
 * unwanted elements to be pushed to the DOM  (with a few exceptions)
 *
 * It will also auto link links based on whether there is an 'http' or 'https' in the message.
 */

const sanitizeHtml = require("sanitize-html");

// function to generate a link
const genLink = (link) => `<a href="${link}" target="_blank">${link}</a>`;

// parse message will split the message up and find links
const parseMessage = (message) => {
  let modMessage = "";
  if (!(message.includes("http://") || message.includes("https://"))) {
    modMessage = modMessage.concat(`<p>`, message, `</p>`);
  } else {
    message = message.split(" ");
    if (message.length === 1) {
      return genLink(message[0]);
    }
    message.forEach((element) => {
      if (element.includes("http://") || element.includes("https://")) {
        if (message.indexOf(element) === 0) {
          modMessage = modMessage.concat(genLink(element), `<p>`);
        } else if (message.indexOf(element) === message.length - 1) {
          modMessage = modMessage.concat(`</p>`, genLink(element));
        } else {
          modMessage = modMessage.concat(`</p>`, genLink(element), `<p> `);
        }
      } else if (message.indexOf(element) === 0) {
        modMessage = modMessage.concat(`<p>`, element);
      } else if (message.indexOf(element) === message.length - 1) {
        modMessage = modMessage.concat(element, `</p>`);
      } else {
        modMessage = modMessage.concat(element, " ");
      }
    });
  }
  return sanitizeHtml(modMessage, {
    allowedTags: ["p", "b", "i", "em", "strong", "a", "marquee"],
    allowedAttributes: {
      a: ["href", "target"],
      p: ["color"],
    },
    allowedIframeHostnames: ["www.youtube.com"],
  });
};

module.exports = { parseMessage };
