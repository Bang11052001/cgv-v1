const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const genre = new Schema({
    _id: Number,
    name: String,
    status : Boolean,
    checked: Boolean
},)

genre.plugin(AutoIncrement,{id: '<genre_id>', inc_field: '_id'});
module.exports = mongoose.model('genre', genre);