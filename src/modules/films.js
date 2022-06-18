const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const film = new Schema({
    _id: Number,
    film_id: Number,
    name: String,
    status : Number,
    image: {
        data: Buffer,
        contentType: String
    },
    genre: String,
    language: String,
    actor: String,
    minute: Number,
    year: Number,
    director: String,
    rated: String,
    description: String,
    sub_category: {
        type: Number,
        ref: 'subcategory'
    },
    quality: [
        {
            _id: {
                type: Number,
                ref : 'quality'
            }
        }
    ],
    key_link: String,
},)

film.plugin(AutoIncrement,{id: '<film_id>', inc_field: '_id'});
module.exports = mongoose.model('film', film);