const express = require('express');
const Promise = require('bluebird'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); dotenv.load();
const compression = require('compression'); 
const app = express(); 
app.use(compression());

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true,
  socketTimeoutMS: 0,
  reconnectTries: 30
});

//App Require 
const Routes = require('./api/routes/routes');
const Webhook = require('./api/webhook/webhook');
//App use
app.use(bodyParser.json());
app.set('json spaces', 2);
app.use(express.static(__dirname + '/client'));

//Client routes 
Routes.general(app);

//Facebook webhook
Webhook.get(app);
Webhook.post(app);

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

//Running server
app.listen(process.env.PORT || 3001, function () {
  console.log('Listening to port 3000')
}); 


