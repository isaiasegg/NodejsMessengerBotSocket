
const User = require('../models/Users');
const Message = require('../messages/messages');
const Actions = require('../actions/actions');

module.exports.receivedMessage = function (event) {
  var senderId = event.sender.id;
  var message = event.message.text;
  var quick_reply = event.message.quick_reply ? event.message.quick_reply.payload : false; 

  if (/CALIFICACION_/.test(quick_reply)) { 
    Actions.qualification(senderId, quick_reply);
  }

  if (/REGISTRARME/.test(quick_reply)) { 
    Actions.register(senderId);
  }

  if(!quick_reply){
    switch (message) {
      default:
        Actions.defaultMsg(senderId, message);
        break;
    }
  }
};


module.exports.receivedPostback = function (event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;
  var referral = event.postback.referral ? event.postback.referral.ref : undefined; 
 
  switch (payload) { 
    default:
      console.log('Default Payload');
      break;

  }
}




