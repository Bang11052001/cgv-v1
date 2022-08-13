const mongoose = require('mongoose');
const {Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const receipt = new Schema({
    _id: Number,
    user: {
        _id: Number,
        name: String,
        password: String,
        gender: String,
        phone: String,
        email: String,
        date: String,
        site: String,
    },
    cinema: [{
        _id: Number,
        name: String,
        status : Boolean,
        area: {
            _id: Number,
            name: String,
            status: Boolean
        },
        rooms: [{
            name: String,
            row: Number,
            column: Number,
            status: Boolean,
            showTimes:[{
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
                    time: String,
                    expired: String,
                    date: String,
                    status: Boolean,
                }]
        }]
    }],
    status: Boolean,
    seats: [{
        name: String
    }],
    total: String,
},{
    timestamps: true
})

receipt.plugin(AutoIncrement,{id: '<receipt_id>', inc_field: '_id'});
module.exports = mongoose.model('receipt', receipt);