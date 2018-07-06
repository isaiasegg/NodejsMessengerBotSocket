
const Message = require('../messages/messages'); 

module.exports.receivedMessage = function (event, socket) {
  var senderId = event.sender.id;
  var message = event.message.text;
  var quick_reply = event.message.quick_reply ? event.message.quick_reply.payload : false; 

  //Send msg to client conected 
  socket.emit('msg', { txt: message });

  //Do something with the message
  if (!quick_reply) {
    switch (message) {
      default:
        Message.msg(socket, senderId, 'Hola, esto es un mensaje default!');
        break;
    }
  } else{ 
    switch (quick_reply) {
      default:
        Message.msg(socket, senderId, 'Este fue tu quick reply: '+quick_reply)
        break;
    }
  }
}

module.exports.receivedPostback = function (event, socket) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;
  var referral = event.postback.referral ? event.postback.referral.ref : undefined;

  switch (payload) {
    default:
      console.log('Default Payload');
      break; 
  }
}

