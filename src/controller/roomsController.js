const Room = require('../modules/room')
const Cinema = require('../modules/cinemas')
const Seat = require('../modules/seat')
const SeatType = require('../modules/seatType')

var roomController={
    index(req,res,next) {
        Cinema.findById({_id: req.query.cinema_id})
            .then((cinema) => {
                cinema = cinema.toObject();
                res.render('admin/rooms/index',{
                    layout: 'main2',
                    cinema
                });
            })
            .catch(error => next(error));
    },
    create(req,res,next) {
        Promise.all([Cinema.findById({_id: req.query.cinema_id}),SeatType.find({status: true})])
            .then(([cinema,seatTypes]) =>{
                cinema = cinema.toObject();
                seatTypes = seatTypes.map(curr => curr.toObject());
                res.render('admin/rooms/create',{
                    layout: 'main2',
                    cinema,
                    seatTypes
                });
            })
            .catch(err => err.status(400).send(err.message));
    },
    handleCreate(req,res,next) {
        SeatType.find({status: true})
            .then(seatTypes => {
                seatTypes = seatTypes.map(curr => curr.toObject());
                return seatTypes;
            })
            .then(seatTypes => {
                req.body.seats = req.body.seats.map(curr => {
                    curr = curr.split(',');
                    var type = seatTypes.find(type => type.name == curr[1])
                    return {
                        name: curr[0],
                        brand: type,
                    }
                })
                req.body.status = true;
                return req.body;
               
            })
            .then((data) =>{
                Cinema.findById({_id: req.query.cinema_id})
                    .then(cinema => {
                        cinema.rooms.push(data);
                        cinema.save(function(err){
                            if(!err){
                                res.redirect(`/admin/rooms/create?cinema_id=${req.query.cinema_id}`);
                            }
                            else{
                                console.log('that bai');
                            }
                        });
                  
                    })
                    .catch(err => res.status(400).send(err.message));       
            })
            .catch(err => res.status(400).send(err.message));
    },
    update(req,res,next) {
        Promise.all([
            Cinema.findById({_id : req.query.cinema_id}),
            SeatType.find({status: true}),
        ])
            .then(([cinema,seatTypes]) => {
                cinema = cinema.toObject();
                var room = cinema.rooms.find(curr => curr._id == req.query.room_id);
                var seats = room.seats;
                seatTypes = seatTypes.map(curr => curr.toObject());
                var result =[];
                
                seats.map((seat,index) => {
                    if(!result.some(curr => curr.name == seat.name[0]))
                        if((result[result.length-1])){
                            if(String.fromCharCode((result[result.length-1].name).charCodeAt(0) + 1) == seat.name[0]){
                                result.push({name : seat.name[0], brand: seat.brand,color: seat.brand.color, seats: []});
                            }
                            else{
                                var length = seat.name[0].charCodeAt(0) - (result[result.length-1].name).charCodeAt(0);
                                for(let i =1 ; i<length ; i++){
                                    result.push({name : String.fromCharCode((result[result.length-1].name).charCodeAt(0) + 1), brand : {color: 'red'}, seats: []});
                                }
                                result.push({name : seat.name[0], brand: seat.brand,color: seat.brand.color, seats: []});
                            }
                        }
                        else{
                            var length = seat.name[0].charCodeAt(0) - ('A').charCodeAt(0);
                            if(length !=0){
                                for(let i=0;i<length ;i++){
                                    result.push({name : String.fromCharCode(('A').charCodeAt(0) + i), brand : {color: 'red'}, seats: []});
                                }
                                result.push({name: seat.name[0], brand: seat.brand,color: seat.brand.color, seats: []})
                            }
                            else{
                                result.push({name: seat.name[0], brand: seat.brand, color: seat.brand.color, seats: []})
                            }
                        }
                    })

                result.map(curr => {
                    let dem =1;
                    var color ='';
                    seats.map(seat => {
                        if(curr.name == seat.name[0]){
                            if(curr.seats[curr.seats.length-1]){
                                if(parseInt(seat.name.slice(1) - curr.seats[curr.seats.length-1].name[1]) == 1)
                                {
                                    curr.seats.push({
                                        name : seat.name,
                                    });
                                    dem++;
                                }
                                else{
                                    var length = seat.name.slice(1) - curr.seats[curr.seats.length-1].name.slice(1);
                                    for(let i=0;i<length -1;i++){
                                        curr.seats.push({
                                            name : '', 
                                            index : dem++,
                                        });
                                    }
                                    curr.seats.push({
                                        name : seat.name,
                                    });
                                    dem++;
                                }
                            }
                            else{
                                var length = room.column - seat.name.slice(1);
                                for(let i=0;i<room.column - length -1;i++){
                                    curr.seats.push({
                                        name : '',
                                        index : dem++,
                                    });

                                }
                                curr.seats.push({
                                    name : seat.name,
                                });
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
                console.log('result',result)
                res.render('admin/rooms/update',{
                    layout: 'main2',
                    room,
                    result,
                    cinema,
                    seatTypes
                });
            })
            .catch(error => next(error));
    },
    handleUpdate(req,res,next) {
        Cinema.findById({_id: req.query.cinema_id})
            .then((cinema) =>{
                req.body.seats = req.body.seats.map(curr => {
                            curr = curr.split(',');
                            return curr ={
                                name  : curr[0],
                                brand: {
                                    _id: curr[1],
                                    name: curr[2],
                                    price: curr[3],
                                    color: curr[4],
                                    status: true
                                }
                            }
                        })
                cinema.rooms.id(req.query.room_id).set(req.body)
                cinema.save()
                    .then(() =>{
                        res.redirect('/admin/rooms?cinema_id='+ req.query.cinema_id );
                    })
                    .catch(err => res.status(400).send(err.message))
            })
            .catch(err => res.status(400).send(err.message))
    },
    delete(req,res,next) {
        Cinema.findById({_id : req.query.cinema_id})
            .then((cinema) =>{
                cinema.rooms.id(req.query.room_id).remove();
                cinema.save()
                    .then(() => {
                        res.redirect('/admin/rooms?cinema_id='+ req.query.cinema_id );
                    })
                    .catch(err => res.status(400).send(err.message))
            })
            .catch(err => next(err));
    },
}
  
module.exports = roomController;