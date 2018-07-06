const request = require('request');
const Promise = require("bluebird");  

module.exports.callSendAPI = function (messageData) {
  return new Promise(
    function(resolve, reject){
      request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;  
          resolve(recipientId)
        } else {
          console.error(body.error); 
          reject(error);
        }
      });
    });
}

 