const { populate } = require('../modules/category');
const Room = require('../modules/room')
const Cinema = require('../modules/cinemas')

var roomController={
    index(req,res,next) {
        Promise.all([Cinema.findById({_id: req.query.cinema_id}).populate('area'),Room.find({cinema_id: req.query.cinema_id})])
            .then(([cinema,rooms]) => {
                cinema = cinema.toObject();
                rooms = rooms.map(room => room.toObject());
                console.log(rooms)
                res.render('admin/rooms/index',{
                    layout: 'main2',
                    cinema,
                    rooms
                });
            })
            .catch(error => next(error));
    },
    update(req,res,next) {
        Room.findById({_id : req.query.room_id, cinema_id: req.query.cinema_id})
        .then(room =>{
            room = room.toObject();
            var room_id = req.query.room_id;
            var cinema_id = req.query.cinema_id;
            res.render('admin/rooms/update',{
                layout: 'main2',
                room,
                room_id,
                cinema_id
            });
        })
        .catch(err => next(err));
    },
    delete(req,res,next) {
        Room.deleteOne({_id : req.query.room_id})
            .then(() =>{
                res.redirect('/admin/rooms?cinema_id='+ req.query.cinema_id);
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        Cinema.find({status: 1})
            .then((cinemas) =>{
                cinemas = cinemas.map(cinema => cinema.toObject());
                res.render('admin/rooms/create',{
                    layout: 'main2',
                    cinemas
                });
            })
            .catch(err => next(err));
    },
    handleCreate(req,res,next) {
        const room = new Room(req.body);
        room.save()
            .then(() =>{
                res.redirect('/admin/rooms/create');
            })
    },
    handleUpdate(req,res,next) {
        console.log(req.query.room_id)
        Room.updateOne({_id : req.query.room_id},req.body) 
            .then((room) =>{
                res.redirect('/admin/rooms/?cinema_id=' + req.query.cinema_id);
            })
    },
}
module.exports = roomController;