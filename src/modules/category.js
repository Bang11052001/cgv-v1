const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const category = new Schema({
    _id: Number,
    category_id: Number,
    name: String,
    status: Number,
    sub_menu: [
        {
            _id:{
                type: 'Number',
                ref: 'subcategory'
            }
        }
    ]
})

category.plugin(AutoIncrement,{id: '<category_id>', inc_field: '_id'});
module.exports = mongoose.model('category', category);