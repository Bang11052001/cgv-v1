const { populate } = require('../modules/category');
const Cinema = require('../modules/cinemas')
const Area = require('../modules/area');
const Room = require('../modules/room');

var cinemaController={
    index(req,res,next) {
        Cinema.find().populate('area')
            .then((cinemas) => {
                cinemas = cinemas.map(cinema => cinema.toObject());
                res.render('admin/cinemas/index',{
                    layout: 'main2',
                    cinemas,
                });
            })
            .catch(error => next(error));
    },
    update(req,res,next) {
        Promise.all([Cinema.findById({_id : req.query.id}).populate('area'),Area.find({status:1})])
            .then(([cinema,areas]) =>{
                cinema = cinema.toObject();
                areas = areas.map(area => area.toObject());
                res.render('admin/cinemas/update',{
                    layout: 'main2',
                    cinema,
                    areas
                });
            })
            .catch(err => next(err));
    },
    delete(req,res,next) {
        Cinema.deleteOne({_id : req.query.id})
            .then(() =>{
                res.redirect('/admin/cinemas');
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        Area.find({status: 1})
        .then((areas) =>{
            areas = areas.map(area => area.toObject());
            res.render('admin/cinemas/create',{
                layout: 'main2',
                areas
            });
        })
        .catch(err => next(err));
    },
    handleCreate(req,res,next) {
        const cinema = new Cinema(req.body);
        cinema.save()
            .then(() =>{
                res.redirect('/admin/cinemas/create');
            })
    },
    handleUpdate(req,res,next) {
        Cinema.updateOne({_id : req.query.id},req.body) 
            .then((cinema) =>{
            })
    },
}
module.exports = cinemaController;