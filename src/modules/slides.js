const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const slide = new Schema({
    _id: Number,
    name: String,
    image: {
        data: Buffer,
        contentType: String
    },
    status : Number,
},)

slide.plugin(AutoIncrement,{id: '<slide_id>', inc_field: '_id'});
module.exports = mongoose.model('slide', slide);