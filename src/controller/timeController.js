const SubCategory = require('../modules/subCategory')

var subCategoryItemController={
    update(req,res,next) {
        SubCategory.findById({_id : req.query.id})
        .then(category =>{
            category = category.toObject();
            res.render('admin/subcategorys/update',{
                layout: 'main2',
                category
            });
        })
        .catch(err => next(err));
    },
    delete(req,res,next) {
        SubCategory.deleteOne({_id : req.query.id})
            .then(subCategory =>{
                res.redirect('/admin/categorys');
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        res.render('admin/subcategorys/create',{
            layout: 'main2',
        });
    },
    handleCreate(req,res,next) {
        const subCategory = new SubCategory(req.body);
        subCategory.save()
            .then(() =>{
                res.redirect('/admin/subcategorys/create');
            })
    },
    handleUpdate(req,res,next) {
        SubCategory.updateOne({_id : req.query.id},req.body)
            .then(film =>{
                res.redirect('/admin/categorys');
            })
            .catch(err => next(err))
    },
}
module.exports = subCategoryItemController;