const Quality = require('../modules/quality')

var QuaylitiesController={
    index(req,res,next) {
        Quality.find()
        .then((qualities) => {
            qualities = qualities.map(qualitie => qualitie.toObject());
            res.render('admin/qualities/index',{
                layout: 'main2',
                qualities
            });
        })
        .catch(error => next(error));
    },
    update(req,res,next) {
        Quality.findById({_id : req.query.id})
        .then(quality =>{
            quality = quality.toObject();
            res.render('admin/qualities/update',{
                layout: 'main2',
                quality
            });
        })
        .catch(err => next(err));
    },
    delete(req,res,next) {
        Quality.deleteOne({_id : req.query.id})
            .then(() =>{
                res.redirect('/admin/qualities');
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        res.render('admin/qualities/create',{
            layout: 'main2',
        });
    },
    handleCreate(req,res,next) {
        const quality = new Quality(req.body);
        quality.save()
            .then(() =>{
                res.redirect('/admin/qualities/create');
            })
    },
    handleUpdate(req,res,next) {
        console.log(req.body)
        Quality.updateOne({_id : req.query.id},req.body)
            .then(() =>{
                res.redirect('/admin/qualities');
            })
            .catch(err => next(err))
    },
}
module.exports = QuaylitiesController;