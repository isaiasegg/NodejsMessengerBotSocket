const User = require('../models/Users');
const Records = require('../models/Records');
const Promise = require('bluebird');
const Message = require('../messages/messages');

//User.remove((err, deleted) => {})
//Records.remove((err, deleted) => {})

module.exports.general = function (app) {

  app.get('/api/meta', function (req, res) {
    const meta = {
      local: process.env.LOCAL
    }
    res.json(meta)
  });

  app.get('/api/users', function (req, res) {
    User.find({}, (err, users) => {
      if (err) { throw err; }
      res.json(users);
    })
  });

  app.get('/api/user/:id', function (req, res) {
    User.findOne({ _id: req.params.id }, (err, users) => {
      if (err) { throw err; }
      res.json(users);
    })
  });

  app.get('/api/records', function (req, res) {
    Records.find({}, (err, records) => {
      if (err) { throw err; }
      res.json(records);
    })
  });

  app.put('/api/usercalled/:id', function (req, res) {
    let user = req.body;
    user.called = true;
    user.called_time = new Date();
    user.registered = false;
    User.findByIdAndUpdate(req.params.id, { $set: user }, { new: true }, (err, updated) => {
      if (err) { throw err; };
      Message.msg(req.body.fbId, `Tu pedido ya está listo 🎉🎉, puedes pasar a retirarlo. Disfrutalo!!!`); 
    });
  })

  app.put('/api/userfinished/:id', function (req, res) {
    let user = req.body;
    user.called = false;
    user.finished = true;
    user.finished_time = new Date();

    Records.create(user, (err, user) => {
      if (err) { throw err; };
      User.findByIdAndRemove(req.params.id, (err, deleted) => {
        if (err) { throw err; };
        let qr = [];
        for (let i = 1; i <= 5; i++) {
          qr.push({ content_type: "text", title: i, payload: "CALIFICACION_" + i });
          if (i === 5) {
            Message.msgQrply(req.body.fbId, `Gracias por preferirnos. Califica nuestro servicio para siempre brindarte la mejor calidad 🤗`, qr);
            res.json(deleted);
          };
        };
      });
    }); 
  });
}