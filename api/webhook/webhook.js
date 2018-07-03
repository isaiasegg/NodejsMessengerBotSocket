
const Received = require('../messages/receivedFns');
const Admins = require('../models/Admins');
const Message = require('../messages/messages');

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
                    Admins.findOne({ loggedIn: true }, (err, user) => {
                        if (err) { throw err };
                        if (!user) { return Message.msg(event.sender.id, `Lo sentimos, ${process.env.LOCAL} se encuentra cerrado en este momento. Intenta más tarde.`); };
                        if (event.message) {
                            Received.receivedMessage(event);
                        } else if (event.postback) {
                            Received.receivedPostback(event);
                        } else {
                            console.log("Webhook received unknown event: ", event);
                        };
                    });
                });
            });
            res.sendStatus(200);
        }
    })
}
