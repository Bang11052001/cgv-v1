const mongoose = require('mongoose');
const {Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const showtime = new Schema({
    _id: Number,
    cinema_id: {
        type: Number,
        ref: 'cinema'
    },
    room_id: {
        type: Number,
        ref: 'room'
    },
    film_id: {
        type: Number,
        ref: 'film'
    },
    quality_id:{
        type: Number,
        ref: 'quality'
    },
    status: Number,
    time: String,
    date: String,
})

showtime.plugin(AutoIncrement,{id: '<showtime_id>', inc_field: '_id'});
module.exports = mongoose.model('showtime', showtime);