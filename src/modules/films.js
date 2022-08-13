const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const film = new Schema({
    _id: Number,
    film_id: Number,
    name: String,
    status : Boolean,
    image: {
        data: Buffer,
        contentType: String
    },
    genre: [
        {
            _id: Number,
            name: String,
            status: Boolean
        }
    ],
    language: String,
    actor: String,
    minute: Number,
    year: Number,
    director: String,
    rated: String,
    description: String,
    category: [
        {
            _id: Number,
            name: String,
            slug: String,
            status: Boolean,
            module: String,
            parent_id: Number
        }
    ],
    quality: [
        {
            _id: Number,
            name: String,
            status: Boolean,
            price: Number
        }
    ],
    link: String,
    slug: String,

},)

film.plugin(AutoIncrement,{id: '<film_id>', inc_field: '_id'});
module.exports = mongoose.model('film', film);