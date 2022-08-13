const mongoose = require('mongoose');
const {Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const seat = new Schema({
    name: String,
    color: String,
    room_id: Number,
    brand: String,
    status: Number,
})

module.exports = mongoose.model('seat', seat);