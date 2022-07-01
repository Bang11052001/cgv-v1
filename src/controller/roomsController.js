const { populate } = require('../modules/category');
const Room = require('../modules/room')
const Cinema = require('../modules/cinemas')

var roomController={
    index(req,res,next) {
        Promise.all([Cinema.findById({_id: req.query.cinema_id}).populate('area'),Room.find({cinema_id: req.query.cinema_id})])
            .then(([cinema,rooms]) => {
                cinema = cinema.toObject();
                rooms = rooms.map(room => room.toObject());
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
        var column = req.body.column;
        var row = req.body.row;
        var cinema_id = req.body.cinema_id;
        var name = req.body.name;
        var status = req.body.status;
        var seats = [];
        var brandNormalPrice = req.body.brandNormalPrice;
        var brandVipPrice = req.body.brandVipPrice;
        var brandSweetboxPrice = req.body.brandSweetboxPrice;

        delete req.body.column;
        delete req.body.row;
        delete req.body.cinema_id;
        delete req.body.name;
        delete req.body.status;
        delete req.body.brandNormalPrice;
        delete req.body.brandVipPrice;
        delete req.body.brandSweetboxPrice;
        
        for(i in req.body){
            req.body[i] = req.body[i].split(',');

            req.body[i] = {
                name : req.body[i][0],
                brand : req.body[i][1],
            }

            if(('brandNormalPrice'.toLowerCase()).includes(req.body[i].brand)){
               req.body[i].price = brandNormalPrice;
            }
            if(('brandVipPrice'.toLowerCase()).includes(req.body[i].brand)){
                req.body[i].price = brandVipPrice;
            }
            if(('brandSweetboxPrice'.toLowerCase()).includes(req.body[i].brand)){
                req.body[i].price = brandSweetboxPrice;
            }

            seats.push(req.body[i]);
        }
        const room = new Room({column, row, cinema_id, name, status, seats});
        room.save()
            .then(() =>{
                res.render('admin/rooms/create',{
                    layout: 'main2',
                });
            })
    },
    handleUpdate(req,res,next) {
        Room.updateOne({_id : req.query.room_id},req.body) 
            .then((room) =>{
                res.redirect('/admin/rooms/?cinema_id=' + req.query.cinema_id);
            })
    },
}
module.exports = roomController;