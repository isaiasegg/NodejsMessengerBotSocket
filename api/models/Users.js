var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: { type: String }, 
});

var User = module.exports = mongoose.model('User', UserSchema);
