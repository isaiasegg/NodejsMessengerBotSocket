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

module.exports.promos = function (senderId) {
  setTimeout(() => { 
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
  }, 5000);
}

promos2 = (senderId) => {
  var messageData = { recipient: { id: senderId }, message: { attachment: { type: 'template', payload: { template_type: 'generic', elements: [] } } } };

  let promos = [
    {
      title: 'Watermelon',
      image_url: 'http://ilovepoh.cl/wp-content/uploads/2017/11/IMG-2109-600x600.jpg',
      subtitle: '$9.500',
      url: 'http://ilovepoh.cl/producto/watermelon/'
    },
    {
      title: 'Mirrors',
      image_url: 'http://ilovepoh.cl/wp-content/uploads/2017/10/IMG-2141-3-600x600.jpg',
      subtitle: '$9.500',
      url: 'http://ilovepoh.cl/producto/mirrors1/'
    }
  ];

  for (let i = 0; i < promos.length; i++) {
    messageData.message.attachment.payload.elements.push({ title: promos[i].title, image_url: promos[i].image_url, subtitle: promos[i].subtitle, default_action: { type: 'web_url', url: promos[i].url }, buttons: [{ type: 'element_share' },], })
    if ((i + 1) === promos.length) { Send.callSendAPI(messageData); };
  }

}