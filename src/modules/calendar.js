const mongoose = require('mongoose');
const {Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const calendar = new Schema({
    _id: Number,    
    room_id: String,
    cinema_id: Number,
    start_time: String,
    end_time: String,
    date: String
})

calendar.plugin(AutoIncrement,{id: '<calendar>', inc_field: '_id'});
module.exports = mongoose.model('calendar',calendar);