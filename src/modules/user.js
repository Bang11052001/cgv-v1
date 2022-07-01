const mongoose = require('mongoose');
const {Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const user = new Schema({
    _id: Number,
    name: String,
    password: String,
    gender: String,
    phone: Number,
    email: String,
    date: String,
    site: String,
    cinema_favourite: String,
    site: String,
})

user.plugin(AutoIncrement,{id: '<user_id>', inc_field: '_id'});
module.exports = mongoose.model('user', user);