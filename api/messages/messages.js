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
 