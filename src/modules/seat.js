const mongoose = require('mongoose');
const {Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const seat = new Schema({
    _id: Number,
    room_id: Number,
    name: String,
    brand: String,
    price: Number,
    status: Number,
})

seat.plugin(AutoIncrement,{id: '<seat_id>', inc_field: '_id'});
module.exports = mongoose.model('seat', seat);