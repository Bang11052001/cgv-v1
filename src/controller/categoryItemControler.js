const { populate } = require('../modules/category');
const Category = require('../modules/category')
const SubCategory = require('../modules/subCategory')

var categoryItemController={
    index(req,res,next) {
        Promise.all([SubCategory.find(),Category.find().populate('sub_menu._id')])
        .then(([subCategorys,categorys]) => {
            subCategorys = subCategorys.map(subCategory => subCategory.toObject());
            categorys = categorys.map(category => category.toObject());
            res.render('admin/categorys/index',{
                layout: 'main2',
                categorys,
                subCategorys
            });
        })
        .catch(error => next(error));
    },
    update(req,res,next) {
        Category.findById({_id : req.query.id})
        .then(category =>{
            category = category.toObject();
            res.render('admin/categorys/update',{
                layout: 'main2',
                category
            });
        })
        .catch(err => next(err));
    },
    delete(req,res,next) {
        Category.deleteOne({_id : req.query.id})
            .then(categorys =>{
                res.redirect('/admin/categorys');
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        res.render('admin/categorys/create',{
            layout: 'main2',
        });
    },
    handleCreate(req,res,next) {
        var sub_menu_id = (req.body.subcategory_id).split(',');
        const category = new Category(req.body);
        sub_menu_id.map(item => {
            category.sub_menu.push({_id : item})
        })
        category.save()
            .then(() =>{
                res.redirect('/admin/categorys/create');
            })
    },
    handleUpdate(req,res,next) {
        var sub_menu_id = (req.body.sub_menu_id).split(',');
        Category.updateOne({_id : req.query.id},req.body) 
        Category.findById({_id : req.query.id})
            .then((category) =>{
                category.sub_menu=[];
                sub_menu_id.map(item => {
                    category.sub_menu.push({_id : item})
                })
                category.save()
                res.redirect('/admin/categorys');
            })
    },
}
module.exports = categoryItemController;