
const User = require('../models/Users'); 
const Message = require('../messages/messages'); 

module.exports.receivedMessage = function (event) { 
  var recipientID = event.recipient.id; 
  var message = event.message.text; 
  switch (message) { 
    case 'a':
      Message.msg(recipientID, 'Hola registra tu numero: 012');
      break;
    case '012':
      Message.msg(recipientID, 'Te hemos registrado en la fila virtual, te avisaremos al tener tu comida lista!');
      break;
    case 'Cancelar':
      Message.msg(recipientID, 'Gracias por hacer la fila con gFood');
      break;
    default:
      console.log('No entendi');
      break;
  }
};


module.exports.receivedPostback = function (event) { 
  var recipientID = event.recipient.id; 
  var payload = event.postback.payload;
  var referral = event.postback.referral ? event.postback.referral.ref : undefined; 
  
  switch (payload) { 
    case 'button':
      console.log('payload');
      break;
    default:
      console.log('Default Payload');
      break;

  }
}
 



