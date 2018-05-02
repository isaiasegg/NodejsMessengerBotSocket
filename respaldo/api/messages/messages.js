const Send = require('./callSendAPI');
const User = require('../models/Users'); 
//Hola
module.exports.msg = function (recipientId, message) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: message
    }
  };
  Send.callSendAPI(messageData);
}