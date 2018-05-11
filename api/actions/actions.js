const User = require('../models/Users');
const Records = require('../models/Records');
const Message = require('../messages/messages');
const request = require('request');
const Promise = require('bluebird');

const moment = require('moment');
const momentTz = require('moment-timezone');

const CronJob = require('cron').CronJob;

const defaultMsg = module.exports.defaultMsg = function (senderId, msg) {
  User.findOne({ fbId: senderId }, (err, user) => {
    if (err) { return err };
    if (user) {
      if (user.registering) {
        User.findOneAndUpdate({ fbId: senderId }, { $set: { invoice: msg, registered: true, registered_time: new Date(), registering: false } }, { new: true }, (err, user) => {
          if (err) { return err };
          Message.msg(senderId, `Muy bien. Ahora busca tu mesa mientras, yo espero por tu pedido.`);
        });
      }
      if (user.registered) {
        Message.msg(senderId, `Tu comida se está preparando, esperame un poco 🙌`)
      }
    } else {
      request('https://graph.facebook.com/v2.6/' + senderId + '?fields=first_name&access_token=' + process.env.PAGE_ACCESS_TOKEN, function (error, response, body) {
        if (err) { return err; };
        const user = JSON.parse(body);
        let qr = [
          { content_type: "text", title: "Registrarme", payload: "REGISTRARME" }
        ];
        Message.msgQrply(senderId, `Excelente. para comenzar presiona "Registrame", acto seguido ingresas tu numero de orden y enviar`, qr);
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
  });
}

module.exports.processLocation = function (senderId, location) {
  let getDistance = Math.floor(distance(location.lat, location.long, process.env.LAT, process.env.LONG, 'K')*1000); 
  if(getDistance > 400){
    Message.msg(senderId, `Lo sentimos este local es solo para clientes en: ${process.env.LOCAL} :(`);
  } else { defaultMsg(senderId); }
} 

createUserCalled = () => {
  const data = { "registering": false, "qualified": false, "fbId": "1698899900194676", "name": "Test User", "gender": "male", "photo": "https://lookaside.facebook.com/platform/profilepic/?psid=1698899900194676&width=1024&ext=1526273328&hash=AeSnrkuGV8ZMhaxI", "registered_time": "2018-05-11T04:48:51.670Z", "registered": false, "invoice": "456", "called_time": "2018-05-11T04:48:57.540Z", "called": true }
  User.create(data, (err, user)=>{
    console.log(user);
  });
}

calledChecker = () => {
  User.find({ called: true }, (err, users) => {
    if (err) { return }; if (!users) { return };
    return Promise.each(users, (user) => {
      var now = new Date(user.called_time);
      var then = new Date;
      var tDiff = moment.utc(moment(then, "DD/MM/YYYY HH:mm:ss").diff(moment(now, "DD/MM/YYYY HH:mm:ss"))).format("mm");
      if (tDiff >= parseInt(process.env.CALLED_NOTIFICATION)) {
        Message.msg(user.fbId, `Tu pedido ya está listo 🎉🎉, puedes pasar a retirarlo. Disfrutalo!!!`);
      }
    });
  });
}


removeCalledChecker = () => {
  User.find({ called: true }, (err, users) => {
    if (err) { return }; if (!users) { return };
    return Promise.each(users, (user) => {
      var now = new Date(user.called_time);
      var then = new Date;
      var tDiff = moment.utc(moment(then, "DD/MM/YYYY HH:mm:ss").diff(moment(now, "DD/MM/YYYY HH:mm:ss"))).format("mm");
      if (tDiff >= parseInt(process.env.CALLED_REMOVAL)) {
        User.findByIdAndRemove(user._id, (err, removed)=>{
          if (err) { return }; if (!users) { return };
          Message.msg(user.fbId, `No retiraste tu pedido. Debes hacer el proceso nuevamente.`);
        });
      };
    });
  });
}

new CronJob('0 */10 * * * *', function() {
  calledChecker();
  }, null, true, 'America/Santiago'
);

new CronJob('0 */10 * * * *', function() {
  removeCalledChecker();
  }, null, true, 'America/Santiago'
);

distance = (lat1, lon1, lat2, lon2, unit) => {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}