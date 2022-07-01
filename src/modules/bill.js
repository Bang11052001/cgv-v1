const mongoose = require('mongoose');
const {Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const bill = new Schema({
    _id: Number,
    cinema_id: Number,
    name: String,
    status: Number,
    row: Number,
    column: Number,
    seats: [
    ]
})

bill.plugin(AutoIncrement,{id: '<bill_id>', inc_field: '_id'});
module.exports = mongoose.model('bill', bill);