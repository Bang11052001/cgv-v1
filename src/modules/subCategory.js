const mongoose = require('mongoose');
const {Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const subcategory = new Schema({
    _id: Number,
    subcategory_id: Number,
    name: String,
    link: String,
    status: Number,
})

subcategory.plugin(AutoIncrement,{id: '<subcategory_id>', inc_field: '_id'});
module.exports = mongoose.model('subcategory', subcategory);