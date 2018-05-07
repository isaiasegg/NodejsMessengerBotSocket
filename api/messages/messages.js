const Send = require('./callSendAPI');
const User = require('../models/Users');
const Promise = require('bluebird');

module.exports.msg = function (senderId, message) {
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
      resolve(senderId);
    });;
  })
}

module.exports.msgQrply = function (senderId, message, qr) {
  var messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      text: message,
      quick_replies: qr
    }
  };
  Send.callSendAPI(messageData);
}

module.exports.promos = function (senderId, message) {
  var messageData = {
    recipient: {
      id: senderId
    },
    message: {
      text: 'Mientras esperas, hecha un vistazo a estas ofertas 🤓'
    }
  };
  Send.callSendAPI(messageData).then((f) => {
    promos2(senderId);
  });
}

promos2 = (senderId) => {
  var messageData = { recipient: { id: senderId }, message: { attachment: { type: 'template', payload: { template_type: 'generic', elements: [] } } } };

  let promos = [
    {
      title: 'Zapatos Adidas',
      image_url: 'https://via.placeholder.com/300x300?text=ADIDAS',
      subtitle: '30% de descuento',
      url: 'https://gmz-gfood.herokuapp.com/assets/img/mapa.png'
    },
    {
      title: 'Almohada Homy',
      image_url: 'https://via.placeholder.com/300x300?text=HOMY',
      subtitle: '2x1 - Compra una almohada y lleva otra',
      url: 'https://gmz-gfood.herokuapp.com/assets/img/mapa.png'
    }
  ];

  for (let i = 0; i < promos.length; i++) {
    messageData.message.attachment.payload.elements.push({ title: promos[i].title, image_url: promos[i].image_url, subtitle: promos[i].subtitle, default_action: { type: 'web_url', url: promos[i].url }, buttons: [{ type: 'element_share' },], })
    if ((i + 1) === promos.length) { Send.callSendAPI(messageData); };
  }
  
}