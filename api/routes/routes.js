const User = require('../models/Users');
const Admins = require('../models/Admins');
const Records = require('../models/Records');
const Promise = require('bluebird');
const Message = require('../messages/messages');
const Email = require('../utils/email');

module.exports.general = function (app) {

  app.post('/asdcac1546k4ds684f46vx65dh46j/login', (req, res) => {
    Admins.findOne({ superAdmin: true }, (err, user) => {
      if (err) { throw err };
      if (!user) { return res.json({ msg: 'Usuario y/o contraseña incorrecta' }) };
      if (req.body.email === user.email) {
        if (req.body.password === user.password) {
          Admins.findByIdAndUpdate(user._id, { $set: { loggedOut: false, loggedIn: true, loggedInTime: new Date } }, (err, result) => {
            const obj = { id: result._id };
            res.json(obj);
          });
        } else {
          const obj = { msg: "Usuario y/o contraseña incorrecta" }
          res.json(obj);
        };
      } else {
        const obj = { msg: "Usuario y/o contraseña incorrecta" }
        res.json(obj);
      }
    });
  });

  app.post('/api/adminlogin', (req, res) => {
    Admins.find({ adminPass: req.body.password }, (err, admin) => {
      if (!admin) {
        const obj = { msg: "Contraseña incorrecta" }
        return res.json(obj);
      } else {
        const obj = { stats: true }
        res.json(obj);
      }
    }) 

  });

  app.get('/api/meta', function (req, res) {
    const meta = {
      local: process.env.LOCAL
    }
    res.json(meta)
  });

  app.get('/api/logout', function (req, res) {
    Admins.findOneAndUpdate({ superAdmin: true }, { $set: { loggedIn: false, loggedOut: true, loggedOutTime: new Date } }, (err, user) => {
      res.json('done');
    });
  });

  app.get('/api/users', function (req, res) {
    User.find({}, (err, users) => {
      if (err) { throw err; }
      res.json(users);
    })
  });

  app.get('/api/records', function (req, res) {
    Records.find({}, (err, users) => {
      if (err) { throw err; }
      res.json(users);
    });
  });

  app.get('/api/loggeduser/:id', function (req, res) {
    Admins.findOne({ superAdmin: true }, (err, user) => {
      if (req.params.id == user._id) {
        res.json(user);
      } else { res.json({ noExist: true }) }
    });
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

  app.get('/api/admins', function (req, res) {
    Admins.find({}, (err, records) => {
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

  app.put('/api/saveemail/:id', function (req, res) {
    Admins.findByIdAndUpdate(req.params.id, { $set: { email: req.body.email } }, { new: true }, (err, updated) => {
      if (err) { throw err; };
      res.json(updated)
    });
  })

  app.put('/api/changepass/:id', function (req, res) {
    Admins.findByIdAndUpdate(req.params.id, { $set: { password: req.body.newPassword } }, { new: true }, (err, updated) => {
      if (err) { throw err; };
      let params = [req.body.email, "gFood <server@gfood.com>", 'gFood - Cambio de contraseña de cuenta'];
      let body = `
            <p style="font: 12.0px Helvetica; line-height: 20px;"> 
                <b>Tu contraseña nueva de cuenta es:</b> ${updated.password}<br> 
            </p>`;

      Email.sendMail(params[0], params[1], params[2], body).then(function (result) { 
        res.json(updated)
      });

    });
  })

  app.put('/api/saveadminpass/:id', function (req, res) {
    Admins.findByIdAndUpdate(req.params.id, { $set: { adminPass: req.body.adminPass } }, { new: true }, (err, updated) => {
      if (err) { throw err; };
      let params = [req.body.email, "gFood <server@gfood.com>", 'gFood - Cambio de contraseña de administrador'];
      let body = `
            <p style="font: 12.0px Helvetica; line-height: 20px;"> 
                <b>Tu contraseña nueva de adminstrador es:</b> ${updated.adminPass}<br> 
            </p>`;

      Email.sendMail(params[0], params[1], params[2], body).then(function (result) { 
        res.json(updated)
      });

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