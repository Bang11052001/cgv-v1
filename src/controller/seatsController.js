const { populate } = require('../modules/category');
const Room = require('../modules/room')
const Seat = require('../modules/seat')

var seatController={
    index(req,res,next) {
        Room.findById({_id: req.query.room_id})
            .then((room) => {
                room = room.toObject();
                var result =[];
                room.seats.map(seat => {
                    if(!result.some(curr => curr.name == seat.name[0]))
                        if((result[result.length-1])){
                            if(String.fromCharCode((result[result.length-1].name).charCodeAt(0) + 1) == seat.name[0]){
                                result.push({name : seat.name[0], brand: seat.brand, seats: []});
                            }
                            else{
                                result.push({name : String.fromCharCode((result[result.length-1].name).charCodeAt(0) + 1), brand: '', seats: []});
                            }
                        }
                        else{
                            result.push({name: seat.name[0], brand: seat.brand, seats: []})
                        }
                    })

                result.map(curr => {
                    room.seats.map(seat => {
                        if(curr.name == seat.name[0]){
                            if(curr.seats[curr.seats.length-1]){
                                if(parseInt(curr.seats[curr.seats.length-1].name[1]) + 1 == seat.name.slice(1))
                                {
                                    curr.seats.push({name : seat.name});
                                }
                                else{
                                    curr.seats.push({name : ''});
                                    curr.seats.push({name : seat.name});
                                }
                            }
                            else{
                                if(seat.name[1] == 2){
                                    curr.seats.push({name : ''});
                                    curr.seats.push({name : seat.name});

                                }
                                else{
                                    curr.seats.push({name : seat.name});
                                }
                            }
                        }
                    })
                })
                console.log(result[3].seats)
                // console.log(result)
                res.render('admin/seats/index',{
                    layout: 'main2',
                    room,
                    result
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