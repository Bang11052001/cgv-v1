const mongoose = require('mongoose');
const {Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const room = new Schema({
    _id: Number,
    cinema_id: Number,
    name: String,
    status: Number,
    row: Number,
    column: Number,
    seats: Array
})

room.plugin(AutoIncrement,{id: '<room_id>', inc_field: '_id'});
module.exports = mongoose.model('room', room);