const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const area = new Schema({
    _id: Number,
    name: String,
    status : {
        type: Number,
        default: 1
    },
},)

area.plugin(AutoIncrement,{id: '<area>', inc_field: '_id'});
module.exports = mongoose.model('area', area);