const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const news = new Schema({
    _id: Number,
    category: [
        {
            _id: {
                type: Number,
                ref : 'newsCategory'
            }
        }
    ],
    name: String,
    content: String,
    slug: String,
    status: Boolean,
})

news.plugin(AutoIncrement,{id: '<news_id>', inc_field: '_id'});
module.exports = mongoose.model('news', news);