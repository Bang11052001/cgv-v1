const Category = require('../modules/category')

module.exports = function(req,res,next){
    Category.find().populate('sub_menu._id')
        .then(categorys =>{
            categorys = categorys.map(category => category.toObject());
            res.locals.menu = categorys;
            next();
        })
}