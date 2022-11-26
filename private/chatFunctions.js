// Travis Block
// ChatSlash
/** The functions in this file will as as commands that users can type in their messages
 * to perform various functions like making links, image links, help commands etc..
 */



const parseMessage = (message) => {
    let modMessage = "";
    if(!(message.includes("http://") || message.includes("https://"))) {
        modMessage = modMessage.concat(`<p>`,message,`</p>`);
    } else {
    message = message.split(' ');
    if(message.length == 1) {
        return genLink(message[0]);
    } else {
        message.forEach(element => {
            if(element.includes("http://") || element.includes("https://")) {
                    if(message.indexOf(element) == 0){
                        modMessage = modMessage.concat(genLink(element),`<p>`);
                    } else if(message.indexOf(element) == message.length - 1){
                        modMessage = modMessage.concat(`</p>`,genLink(element));
                    } else {
                        modMessage = modMessage.concat(`</p>`,genLink(element),`<p> `);
                    }
                } else {
                    if(message.indexOf(element) == 0){
                        modMessage = modMessage.concat(`<p>`,element);
                    } else if(message.indexOf(element) == message.length - 1){
                        modMessage = modMessage.concat(element,`</p>`);
                    } else {
                        modMessage = modMessage.concat(element," ");
                    }
                }
            });
    }
   
        }
            return modMessage;
        };

const genLink = (link) => {
    return `<a href="${link}" target="_blank">${link}</a>`;
}

module.exports = { parseMessage };