const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const quality = new Schema({
    _id: Number,
    name: String,
    status : Number,
    price: Number
},)

quality.plugin(AutoIncrement,{id: '<quality_id>', inc_field: '_id'});
module.exports = mongoose.model('quality', quality);