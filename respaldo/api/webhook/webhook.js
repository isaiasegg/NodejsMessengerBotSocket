
const Received = require('../messages/receivedFns');

module.exports.get = function (app) {
    app.get('/webhook', function (req, res) {
        if (req.query['hub.verify_token'] === 'gfood_pass') {
            res.send(req.query['hub.challenge']);
            res.send('HTTPS Working')
        } else {
            res.send('Error, wrong validation token');
        }
    })
}

module.exports.post = function (app) {
    app.post('/webhook', function (req, res) {
        var data = req.body;
        if (data.object == 'page') {
            data.entry.forEach(function (entry) {
                var pageID = entry.id;
                var timeOfEvent = entry.time;
                var referral = "";
                
                entry.messaging.forEach(function (event) { 
                    if (event.message) {
                        Received.receivedMessage(event);
                    } else if (event.postback) {
                        Received.receivedPostback(event);
                    } else {
                        console.log("Webhook received unknown event: ", event);
                    }
                });
            });
            res.sendStatus(200);
        }
    })
}
