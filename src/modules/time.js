const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const time = new Schema({
    _id: Number,
    name: String,
    status : Number,
},)

time.plugin(AutoIncrement,{id: '<time_id>', inc_field: '_id'});
module.exports = mongoose.model('time', time);