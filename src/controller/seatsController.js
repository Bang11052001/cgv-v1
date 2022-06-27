const { populate } = require('../modules/category');
const Room = require('../modules/room')
const Seat = require('../modules/seat')

var seatController={
    index(req,res,next) {
        Room.findById({_id: req.query.room_id})
            .then((room) => {
                room = room.toObject();
                console.log(room)
                res.render('admin/seats/index',{
                    layout: 'main2',
                    room,
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
        var column = req.body.column;
        var row = req.body.row;

        delete req.body.column;
        delete req.body.row;

        
        for(i in req.body){
            req.body[i] = req.body[i].split(',');
            req.body[i] ={
                name : req.body[i][0],
                brand : req.body[i][1],
                room_id: req.query.room_id,
            }
            console.log(req.body[i])
            const seat = new Seat(req.body[i]);
            seat.save();
        }
        Room.updateOne({_id: req.query.room_id}, {column: column, row: row})
            .then(room =>{
                res.json(req.body);
            })
            .catch(err => next(err))
        
    },
    handleUpdate(req,res,next) {
        console.log(req.query.room_id)
        Room.updateOne({_id : req.query.room_id},req.body) 
            .then((room) =>{
                res.redirect('/admin/rooms/?cinema_id=' + req.query.cinema_id);
            })
    },
}
module.exports = seatController;