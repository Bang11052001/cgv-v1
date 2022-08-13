const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const newsCategory = new Schema({
    _id: Number,
    parent_id: Number,
    name: String,
    slug: String,
    status: Boolean,
})

newsCategory.plugin(AutoIncrement,{id: '<newsCategory_id>', inc_field: '_id'});
module.exports = mongoose.model('newsCategory', newsCategory);