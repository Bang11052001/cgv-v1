const mongoose = require('mongoose');
const showtime = require('./showtime');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const cinema = new Schema({
    _id: Number,
    name: String,
    status : Boolean,
    area: {
        _id: Number,
        name: String,
        status: Boolean
    },
    rooms: [
        {
            name: String,
            row: Number,
            column: Number,
            status: Boolean,
            seats: [
                {
                name: String,
                brand: {
                    _id: Number,
                    name: String,
                    price: String,
                    status: String,
                    color: String
                },
                status: String
            }],
            showTimes: [
                {
                    film: {
                        _id: Number,
                        name: String,
                        minute: Number,
                        image: {
                            data: Buffer,
                            contentType: String
                        },
                    },
                    quality: {
                        _id: Number,
                        name: String
                    },
                    seats: [
                        {
                        name: String,
                        brand: {
                            _id: Number,
                            name: String,
                            price: String,
                            status: String,
                            color: String
                        },
                        status: String
                    }],
                    time: String,
                    expired: String,
                    date: String,
                    status: Boolean,
                }
            ]
        }
    ]   
},)

cinema.plugin(AutoIncrement,{id: '<cinema>', inc_field: '_id'});
module.exports = mongoose.model('cinema', cinema);