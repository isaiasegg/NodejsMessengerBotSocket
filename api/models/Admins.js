var mongoose = require('mongoose');

var AdminsSchema = new mongoose.Schema({
    loggedIn: { type: Boolean, default: false },
    loggedInTime: { type: Date },
    loggedOut: { type: Boolean, default: false },
    loggedOutTime: { type: Date },
    email: { type: String },
    password: { type: String },
    adminPass: { type: String },
    superAdmin: { type: Boolean },
});

var Admins = module.exports = mongoose.model('Admins', AdminsSchema);
 
