const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); dotenv.load();
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server); 

//App use
app.use(bodyParser.json());
app.set('json spaces', 2);
app.use(express.static(__dirname + '/client'));
 
//Login 
app.post('/api/login', (req, res) => {
  if (req.body.email == process.env.EMAIL && req.body.password == process.env.PASSWORD) {
    res.json({ access: true });
  } else {
    res.json({ msg: 'Usuario y/o contraseña incorrecta' });
  }
}); 

//Facebook webhook
const Webhook = require('./api/webhook/webhook');
Webhook.get(app);
io.on('connection', (socket) => { 
  Webhook.post(app, socket); 
});

//Front end files
app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

//Running server  
server.listen(process.env.PORT || 3001, function () {
  console.log('listening on ' + 3001);
});