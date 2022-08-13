const Cinema = require('../modules/cinemas')
const Area = require('../modules/area');
const Room = require('../modules/room');
const room = require('../modules/room');

var cinemaController={
    index(req,res,next) {
        Cinema.find()
            .then((cinemas) => {
                var dem =0;
                cinemas = cinemas.map(curr => curr.toObject());
                cinemas.map(cinema => {
                    cinema.roomTotal = cinema.rooms.length;
                })
                console.log(cinemas)
                res.render('admin/cinemas/index',{
                    layout: 'main2',
                    cinemas,
                });
            })
            .catch(err => res.status(400).send(err.message));
    },
    create(req,res,next) {
        Area.find({status: true})
            .then((areas) =>{
                areas = areas.map(area => area.toObject());
                res.render('admin/cinemas/create',{
                    layout: 'main2',
                    areas
                });
            })
            .catch(err => res.status(400).send(err.message));
    },
    handleCreate(req,res,next) {
        Area.findById({_id:req.body.area_id})
            .then(area => {
                const cinema = new Cinema(req.body);
                cinema.area = area;
                cinema.save()
                    .then(() =>{
                        res.redirect('/admin/cinemas/create');
                    })
                    .catch(err => res.status(400).send(err.message));
            })
            .catch(err => res.status(400).send(err.message))
    },
    update(req,res,next) {
        Promise.all([Cinema.findById({_id : req.query.id}),Area.find({status:1})])
            .then(([cinema,areas]) =>{
                cinema = cinema.toObject();
                areas = areas.map(area => area.toObject());
                areas.map(curr => {
                    if(curr._id == cinema.area._id){
                        return curr.selected = true;
                    }
                    else 
                        return curr.selected = false;
                })
                console.log(areas)
                res.render('admin/cinemas/update',{
                    layout: 'main2',
                    cinema,
                    areas
                });
            })
            .catch(err => next(err));
    },
    handleUpdate(req,res,next) {
        Cinema.updateOne({_id : req.query.id},req.body) 
            .then(() =>{
                res.redirect('/admin/cinemas');
            })
            .catch(err => res.status(400).send(err.message));
    },
    delete(req,res,next) {
        Cinema.rooms()
            .then(() =>{
                res.redirect('/admin/cinemas');
            })
            .catch(err => next(err));
    },
}
module.exports = cinemaController;