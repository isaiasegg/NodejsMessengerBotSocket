const User = require('../models/Users');
const Clients = require('../models/Clients');
const Cajas = require('../models/Cajas');
const Message = require('../messages/messages');
const Config = require('../config/config');
const request = require('request');
const Settings = require('../models/Settings');

module.exports.canceled = function (recipientId) {
  User.findOne({ userId: recipientId }, (err, user) => {
    if (err) { return console.log(err) };
    var id = user ? user._id : false;
    var updated = {
      inLine: false,
      started: false,
      ended: false,
      sentToCheckout: false,
      onTheWay: false,
      arrivedToCheckout: false,
      hold: false,
      cancelled: true,
      timeCanceledLine: new Date
    }

    User.findByIdAndUpdate(id, { $set: updated }, { new: true }, function (err, userUpdated) {
      if (err) { return console.log(err) };
      Message.canceledMsg(userUpdated.userId);
      console.log("Cancelado");
    });
  });

  User.findOne({ userId: recipientId }, (err, user) => {
    if (user && user.arrivedToCheckout) {
      Cajas.findOne({ numero: user.caja }, (err, caja) => {
        Cajas.findByIdAndUpdate(caja._id, { $set: { attending: caja.attending - 1 } }, { new: true }, (err, updatedCaja) => {
          console.log('removed from attending');
        });
      });
    };
  });
}

module.exports.sentBackToInLine = function (recipientId) {
  var updated = {
    inLine: true,
    hold: false
  }
  User.findOneAndUpdate({ userId: recipientId }, { $set: updated }, { new: true }, function (err, user) {
    if (err) { return console.log(err) };
    console.log("5 more minutes");
  });
}

//5 more minutes 
module.exports.fiveMoreMinutes = function (recipientId) {
  var updated = {
    inLine: false,
    started: false,
    ended: false,
    sentToCheckout: false,
    onTheWay: false,
    arrivedToCheckout: false,
    cancelled: false,
    timeGoToLine: '--',
    timeHold: new Date,
    hold: true,
    timeAsked: Config.holdTime
  }

  User.findOne({ userId: recipientId }, (err, check) => {
    if (!check) { return console.log('User not found fiveMoreMinutes() ') };
    User.findOneAndUpdate({ userId: recipientId }, { $set: updated, $inc: { holdCount: 1 } }, { new: true }, function (err, user) {
      if (err) { return console.log(err) };
      console.log(Config.holdTime + " more minutes");
    });
  });

}

//User accepts going to checkout
module.exports.voyAlaCaja = function (recipientId) {
  User.find(function (err, users) {
    if (!err) {
      var users_data = users;
      var last_user = []
      for (var i = 0; i < users_data.length; i++) {
        if (users_data[i].userId === recipientId) {
          last_user.push(users_data[i])
        }
      }

      var last_user_org = last_user.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      var id = last_user_org[0]._id;

      Clients.findOne({ PSID: recipientId }, function (err, client) {
        var updated = {
          rut: last_user_org[0].rut,
          userId: last_user_org[0].userId,
          name: last_user_org[0].name,
          first_name: last_user_org[0].first_name,
          last_name: last_user_org[0].last_name,
          img: last_user_org[0].img,
          date: last_user_org[0].date,
          inLine: false,
          started: false,
          ended: false,
          sentToCheckout: false,
          onTheWay: true,
          arrivedToCheckout: false,
          cancelled: false,
          timeGoToLine: last_user_org[0].timeGoToLine,
          timeOnTheWay: new Date,
          timeArrivedToLine: last_user_org[0].timeArrivedToLine,
          timeCanceledLine: last_user_org[0].timeCanceledLine,
          timeStart: last_user_org[0].timeStart,
          timeEnd: last_user_org[0].timeEnd,
          ttLine: last_user_org[0].ttLine,
          ttCalled: last_user_org[0].ttCalled,
          ttOnTheWay: last_user_org[0].ttOnTheWay,
          triesLine: last_user_org[0].triesLine,
          otwCount: last_user_org[0].otwCount,
          timeHold: last_user_org[0].timeHold,
          hold: last_user_org[0].hold,
          cellphone: last_user_org[0].cellphone,
          ttCheckout: last_user_org[0].ttCheckout,
          triescamino: last_user_org[0].triescamino,
          th_checkout: last_user_org[0].th_checkout,
          platform: last_user_org[0].platform,
          store: client.storeLast,
          holdCount: last_user_org[0].holdCount,
          messages: last_user_org[0].messages
        };

        User.updateUser(id, updated, {}, function (err, user) {
          if (!err) {
            console.log("Va a la caja");
          } else { console.log(err) }
        });
      });
    } else { console.log(err) }
  })
}

//Make cellphone call through Twillio API
module.exports.makeCall = function (recipientId) {
  User.find({ userId: recipientId }, (err, user) => {

    var accountSid = process.env.accountSid;
    var authToken = process.env.authToken;
    var client = require('twilio')(accountSid, authToken);

    if (user[0].cellphone !== '--') {
      client.calls.create({
        url: "https://disturbed-drink-5326.twil.io/assets/voice.xml",
        to: `+${user[0].cellphone}`,
        from: process.env.phone,
        Timeout: 5
      }, function (err, call) {
        if (err) { return console.log(err) }
        process.stdout.write(call.sid);
      });
    }
  });
}

module.exports.actualizacionLocal = function (recipientId) { 
  var updated = {
    storeLast: "Gran Avenida"
  }

  Clients.findOneAndUpdate({ PSID: recipientId }, { $set: updated }, { new: true }, function (err, user) {
    if (!err) {
      console.log("actualizado local");
    } else { console.log(err) }
  }); 
}

// Call to checkout based on statistical estimated call
module.exports.triggeredCall = (payment, cart, arrivalTime, id) => {

  let cashier_time = 0;
  User.find({ inLine: true }, (err, users) => {
    if (err) { return console.log(err); }
    if (users.length > 0) {
      switch (payment) {
        case 'cash':
          switch (cart) {
            case 'S':
              cashier_time = (parseInt(process.env.S_CASH) + parseInt(process.env.BASE_TIME)) - arrivalTime;
              setTimeout(function () {
                callInlineUser(users[0].id);
              }, cashier_time * 1000);
              break;
            case 'L':
              cashier_time = parseInt(process.env.L_CASH) + parseInt(process.env.BASE_TIME) - arrivalTime;
              setTimeout(function () {
                callInlineUser(users[0].id);
              }, cashier_time * 1000);
              break;
          }
          break;

        case 'card':
          switch (cart) {
            case 'S':
              cashier_time = parseInt(process.env.S_CARD) + parseInt(process.env.BASE_TIME) - arrivalTime;
              setTimeout(function () {
                callInlineUser(users[0].id);
              }, cashier_time * 1000);
              break;
            case 'L':
              cashier_time = parseInt(process.env.L_CARD) + parseInt(process.env.BASE_TIME) - arrivalTime;
              setTimeout(function () {
                callInlineUser(users[0].id);
              }, cashier_time * 1000);
              break;
          }
          break;

        case 'ticket':
          switch (cart) {
            case 'S':
              cashier_time = parseInt(process.env.S_TICKET) + parseInt(process.env.BASE_TIME) - arrivalTime;
              setTimeout(function () {
                callInlineUser(users[0].id);
              }, cashier_time * 1000);
              break;
            case 'L':
              cashier_time = parseInt(process.env.L_TICKET) + parseInt(process.env.BASE_TIME) - arrivalTime;
              setTimeout(function () {
                callInlineUser(users[0].id);
              }, cashier_time * 1000);
              break;
          }
          break;
      }
    } else {
      console.log('No users to call')
    };
  }).sort('date');

}


callInlineUser = (id) => {
  Settings.find((err, settings) => {
    if (settings[0].automatedcall === true && settings[0].checkoutCallOnAttention === false) {
      User.findByIdAndUpdate(id, { $set: { inLine: false, sentToCheckout: true, timeGoToLine: new Date() } }, { new: true }, function (err, user) {
        if (err || !user) { return console.log(err, user); }
        console.log('Llamado automatico de: ' + user.id);
        Message.yaEsTuTurno(user.userId);

        //llamada por Twilio
        if (parseInt(user.triesLine) === Config.toCall) { Action.makeCall(user.userId); }

        //manda cambio de estado a WS
        if (user.platform === "WhatsApp") {
          console.log('Llamado a whatsapp ejecutado: ' + user.first_name)
          request.post({
            headers: { 'content-type': 'application/json' },
            url: process.env.WS_URL + '/api/' + process.env.SECRET_URL,
            body: JSON.stringify({ state: 'sentToCheckout', cellphone: +user.cellphone })
          }, function (err, httpResponse, bodys) {
            if (err) { return console.log(err) }
            console.log(bodys);
            console.log('Enviado con exito a la fila: ' + user.first_name)
          });
        }
      });
    }
  });
} 