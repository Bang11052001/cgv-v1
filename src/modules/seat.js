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

module.exports = mongoose.model('seat', seat);