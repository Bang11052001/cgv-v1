const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const cinema = new Schema({
    _id: Number,
    name: String,
    status : {
        type: Number,
        default: 1
    },
    area: {
        type: Number,
        ref : 'area'
    }
},)

cinema.plugin(AutoIncrement,{id: '<cinema>', inc_field: '_id'});
module.exports = mongoose.model('cinema', cinema);