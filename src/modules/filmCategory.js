const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const filmCategory = new Schema({
    _id: Number,
    parent_id: Number,
    name: String,
    slug: String,
    status: Boolean,
    index: Number,
    module: {
        type: String,
        default: 'danh-muc-phim'
    }
})

filmCategory.plugin(AutoIncrement,{id: '<filmCategory_id>', inc_field: '_id'});
module.exports = mongoose.model('filmCategory', filmCategory);