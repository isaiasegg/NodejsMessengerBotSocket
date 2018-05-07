const User = require('../models/Users');
const Records = require('../models/Records');
const Message = require('../messages/messages');
const request = require('request');

module.exports.defaultMsg = function (senderId, msg) {

  User.findOne({ fbId: senderId }, (err, user) => {
    if (err) { return err };
    if (user) {
      if (user.registering) {
        User.findOneAndUpdate({ fbId: senderId }, { $set: { invoice: msg, registered: true, registered_time: new Date(), registering: false } }, { new: true }, (err, user) => {
          if (err) { return err };
          Message.msg(senderId, `Perfecto, te aviso apenas tu comida esté lista ✌️`).then((f) => {
            setTimeout(() => {
              Message.promos(senderId);
            }, 10000);
          });
        });
      } else {
        Message.msg(senderId, `Tu comida se está preparando, esperame un poco 🙌`)
      }
    } else {
      request('https://graph.facebook.com/v2.6/' + senderId + '?fields=first_name&access_token=' + process.env.PAGE_ACCESS_TOKEN, function (error, response, body) {
        if (err) { return err; };
        const user = JSON.parse(body);
        let qr = [
          { content_type: "text", title: "Registrarme", payload: "REGISTRARME" }
        ];
        Message.msgQrply(senderId, `Hola ${user.first_name} 👋, para comenzar debes registrar tu numero de factura \n\nLuego de presionar "Registrarme" debes ingresar el numero de tu factura, ejemplo: 54154`, qr);
      });
    };
  });
}

module.exports.register = function (senderId) {
  request('https://graph.facebook.com/v2.6/' + senderId + '?fields=first_name,last_name,profile_pic,gender&access_token=' + process.env.PAGE_ACCESS_TOKEN, function (err, response, body) {
    if (err) { console.log(); return err; };
    const user = JSON.parse(body);
    User.create({
      registering: true,
      qualified: false,
      fbId: senderId,
      name: user.first_name + ' ' + user.last_name,
      gender: user.gender,
      photo: user.profile_pic
    }, (err, user) => {
      if (err) { return err };
      console.log('user created');
    });
  });
}

module.exports.qualification = function (senderId, q) {
  Records.findOneAndUpdate({ fbId: senderId, qualified: false }, { $set: { qualification: parseInt(q.split('_')[1]) }, qualified: true }, { new: true }, (err, user) => {
    if (err) { return err };
    Message.msg(senderId, `Muchas gracias!!`);
  });
}
