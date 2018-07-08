const Promise = require('bluebird');
const Send = require('./callSendAPI');

module.exports.msg = function (socket, senderId, message) {
  return new Promise((resolve, reject) => {
    var messageData = {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      }
    };
    Send.callSendAPI(messageData).then((f) => {
      socket.emit('msg', { txt: message });
      resolve(senderId);
    });
  })
}
 
//Repositorio "ready to use" para conectarse al API de Facebook Messenger utilizando Node Js y Express. Además cuenta con un cliente creado en Angular Js y Angular Material donde se muestra toda la conversación que se está llevando desde messenger con el bot, este "streaming" se hace con Socket.io