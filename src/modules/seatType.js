const mongoose = require('mongoose');
const {Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const seatType = new Schema({
    _id: Number,
    name: String,
    price: Number,
    status: Boolean,
    color: String
})

seatType.plugin(AutoIncrement,{id: '<seatType_id>', inc_field: '_id'});
module.exports = mongoose.model('seatType', seatType);