
const Received = require('../messages/receivedFns');

module.exports.get = function (app) {
    app.get('/webhook', function (req, res) {
        if (req.query['hub.verify_token'] === process.env.WEBHOOK_PASS) {
            res.send(req.query['hub.challenge']);
            res.send('HTTPS Working')
        } else {
            res.send('Error, wrong validation token');
        }
    })
}

module.exports.post = function (app, socket) {

    app.post('/webhook', function (req, res) {
        var data = req.body;
        if (data.object == 'page') {
            data.entry.forEach(function (entry) {
                entry.messaging.forEach(function (event) {
                    if (event.message) {
                        Received.receivedMessage(event, socket);
                    } else if (event.postback) {
                        Received.receivedPostback(event, socket);
                    } else {
                        console.log("Webhook received unknown event: ", event);
                    };
                });
            });
            res.sendStatus(200);
        }
    })
}
