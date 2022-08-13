const mongoose = require('mongoose');
const filmCategory = require('./filmCategory');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const menu = new Schema({
    _id: Number,
    parent_id: Number,
    slug: String,
    name: String,
    status: Boolean,
    index: Number,
    module: String,
})

menu.plugin(AutoIncrement,{id: '<menu_id>', inc_field: '_id'});
module.exports = mongoose.model('menu', menu);