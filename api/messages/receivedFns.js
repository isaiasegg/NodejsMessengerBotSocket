
const User = require('../models/Users');
const Message = require('../messages/messages');
const Actions = require('../actions/actions');
const request = require('request');

module.exports.receivedMessage = function (event) {
  var senderId = event.sender.id;
  var message = event.message.text;
  var quick_reply = event.message.quick_reply ? event.message.quick_reply.payload : false;
  let location = event.message.attachments ? event.message.attachments[0].payload ? event.message.attachments[0].payload.coordinates : false : false;

  if (/CALIFICACION_/.test(quick_reply)) {
    Actions.qualification(senderId, quick_reply);
  }

  if (/REGISTRARME/.test(quick_reply)) {
    Actions.register(senderId);
  }

  if (location) { 
    Actions.processLocation(senderId, location); 
  }

  if (!quick_reply && !location) {
    switch (message) {
      default:
        //
        User.findOne({ fbId: senderId }, (err, user) => {
          if (err) { return err };
          if (!user) {
            request('https://graph.facebook.com/v2.6/' + senderId + '?fields=first_name&access_token=' + process.env.PAGE_ACCESS_TOKEN, function (err, response, body) {
              if (err) { console.log(); return err; };
              const user = JSON.parse(body);
              let qr = [
                { content_type: 'location' }
              ];
              Message.msgQrply(senderId, `Hola ${user.first_name}, soy tu asistente para la entrega del pedido.\n\nTe encuentras en ${process.env.LOCAL}, envíame tu ubicacion para confirmar que estés en el local correcto`, qr);
            });
          } else {
            Actions.defaultMsg(senderId, message);
          }
        })
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




