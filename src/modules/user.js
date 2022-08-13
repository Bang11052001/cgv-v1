const mongoose = require('mongoose');
const {Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

const user = new Schema({
    _id: Number,
    name: String,
    password: String,
    gender: String,
    phone: String,
    email: String,
    date: String,
    site: String,
    area: String,
    cinema_favourite: String,
    status: Number
})

user.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });

user.plugin(AutoIncrement,{id: '<user_id>', inc_field: '_id'});
module.exports = mongoose.model('user', user);