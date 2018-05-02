const User = require('../models/Users');
const Promise = require('bluebird');

module.exports.general = function (app) {

  app.get('/api/users', function (req, res) {
    User.find({}, (err, users)=>{
      if(err){ throw err; }
      res.json(users);
    })
  });
  
}
