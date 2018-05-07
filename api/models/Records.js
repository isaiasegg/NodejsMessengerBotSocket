var mongoose = require('mongoose');

var RecordsSchema = new mongoose.Schema({
    fbId: { type: String },
    name: { type: String },
    gender: { type: String },
    photo: { type: String },
    //
    registering: { type: Boolean },
    invoice: { type: String },
    //
    registered: { type: Boolean },
    registered_time: { type: Date },
    //
    finished: { type: Boolean },
    finished_time: { type: Date },
    //
    qualification: { type: Number },
    qualified: { type: Boolean },
});

var Records = module.exports = mongoose.model('Records', RecordsSchema);
