const { populate } = require('../modules/category');
const Area = require('../modules/area')

var areaController={
    index(req,res,next) {
        Area.find()
        .then((areas) => {
            areas = areas.map(area => area.toObject());
            res.render('admin/areas/index',{
                layout: 'main2',
                areas
            });
        })
        .catch(error => next(error));
    },
    update(req,res,next) {
        Area.findById({_id : req.query.id})
        .then(area =>{
            area = area.toObject();
            res.render('admin/areas/update',{
                layout: 'main2',
                area
            });
        })
        .catch(err => next(err));
    },
    delete(req,res,next) {
        Area.deleteOne({_id : req.query.id})
            .then(() =>{
                res.redirect('/admin/areas');
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        res.render('admin/areas/create',{
            layout: 'main2',
        });
    },
    handleCreate(req,res,next) {
        const area = new Area(req.body);
        area.save()
            .then(() =>{
                res.redirect('/admin/areas/create');
            })
    },
    handleUpdate(req,res,next) {
        Area.updateOne({_id : req.query.id},req.body) 
            .then(() =>{
                res.redirect('/admin/areas');
            })
    },
}
module.exports = areaController;