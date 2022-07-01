const { populate } = require('../modules/category');
const Room = require('../modules/room')
const Seat = require('../modules/seat')

var seatController={
    index(req,res,next) {
        Room.findById({_id: req.query.room_id})
            .then((room) => {
                room = room.toObject();
                var result =[];
                room.seats.map((seat,index) => {
                    if(!result.some(curr => curr.name == seat.name[0]))
                        if((result[result.length-1])){
                            if(String.fromCharCode((result[result.length-1].name).charCodeAt(0) + 1) == seat.name[0]){
                                result.push({name : seat.name[0], brand: seat.brand, seats: []});
                            }
                            else{
                                var length = seat.name[0].charCodeAt(0) - (result[result.length-1].name).charCodeAt(0);
                                for(let i =1 ; i<length ; i++){
                                    result.push({name : String.fromCharCode((result[result.length-1].name).charCodeAt(0) + 1), brand: '', seats: []});
                                }
                                result.push({name : seat.name[0], brand: seat.brand, seats: []});
                            }
                        }
                        else{
                            var length = seat.name[0].charCodeAt(0) - ('A').charCodeAt(0);
                            if(length !=0){
                                for(let i=0;i<length ;i++){
                                    result.push({name : String.fromCharCode(('A').charCodeAt(0) + i), brand: '', seats: []});
                                }
                                result.push({name: seat.name[0], brand: seat.brand, seats: []})
                            }
                            else{
                                result.push({name: seat.name[0], brand: seat.brand, seats: []})
                            }

                        }
                    })
                result.map(curr => {
                    let dem =1;
                    room.seats.map(seat => {
                        if(curr.name == seat.name[0]){
                            if(curr.seats[curr.seats.length-1]){
                                if(parseInt(seat.name.slice(1) - curr.seats[curr.seats.length-1].name[1]) == 1)
                                {
                                    curr.seats.push({name : seat.name});
                                    dem++;
                                }
                                else{
                                    var length = seat.name.slice(1) - curr.seats[curr.seats.length-1].name.slice(1);
                                    for(let i=0;i<length -1;i++){
                                        curr.seats.push({name : '', index : dem++});
                                    }
                                    curr.seats.push({name : seat.name});
                                    dem++;
                                }
                            }
                            else{
                                var length = room.column - seat.name.slice(1);
                                for(let i=0;i<room.column - length -1;i++){
                                    curr.seats.push({name : '', index : dem++});

                                }
                                curr.seats.push({name : seat.name});
                                dem++;
                            }
                        }
                    })
                    var rowlength = curr.seats.length;
                    if(curr.seats.length < room.column){
                        for(let i=0;i< room.column - rowlength;i++){
                            curr.seats.push({name : '',index : dem++});
                        }
                        rowlength = curr.seats.length
                    }
                    // if(rowlength < room.row){
                    //     var seatsFake = [];
                    //     for(let i=1; i<= rowlength ; i++){
                    //         seatsFake.push({name : '',brand: '', index : i});
                    //     }
                    //     for(let i=0;i< room.row - result.length ;i++){
                    //         result.push({name : String.fromCharCode((result[result.length-1].name).charCodeAt(0) + 1),brand: '', seats : seatsFake});
                    //     }
                    // }
                })
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
        var result  =[];
        var brandNormalPrice = req.body.brandNormalPrice;
        var brandVipPrice = req.body.brandVipPrice;
        var brandSweetboxPrice = req.body.brandSweetboxPrice;

        delete req.body.column;
        delete req.body.row;
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

            result.push(req.body[i]);
        }
        console.log(result)
        Room.updateOne({_id: req.query.room_id},{$pull : {seats: {}}, column , row})
            .then(room =>{
                Room.findById({_id: req.query.room_id})
                    .then(room =>{
                        result.map(curr => {room.seats.push(curr)})
                        room.save();
                        res.redirect('/admin/seats?room_id='+ req.query.room_id);
                    })
            })
        
    },
    handleUpdate(req,res,next) {
        Room.updateOne({_id : req.query.room_id},req.body) 
            .then((room) =>{
                res.redirect('/admin/rooms/?cinema_id=' + req.query.cinema_id);
            })
    },
}
module.exports = seatController;