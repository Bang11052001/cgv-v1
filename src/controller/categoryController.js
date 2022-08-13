const Film = require('../modules/films')
const FilmCategory = require('../modules/filmCategory')
// const Category = require('../modules/category')
const Area = require('../modules/area')
const Room = require('../modules/room')
const Cinema = require('../modules/cinemas')
const Receipt = require('../modules/receipt')
const User = require('../modules/user')
const jwt = require('jsonwebtoken');

var categoryController={
    show(req,res,next) {
        Promise.all([
            Film.find({status:true, "category.slug": req.params.slug}),
            FilmCategory.find({status: true, slug: req.params.slug})
        ])
            .then(([films,filmCategory]) =>{
                films = films.map(film => film.toObject());
                [filmCategory] = filmCategory.map(filmCategory => filmCategory.toObject());
                res.render('pages/category',{
                    films,
                    breadcumb: filmCategory
                });
            })
            .catch(err => next(err));
    },
    detail(req,res,next) {
        Film.find({status: true, slug :req.params.slug})
            .then(film => {
                [film] = film.map(curr => curr.toObject());
                res.render('pages/fiml',{
                    film
                });
            })
    },
    booking(req,res,next) {
        Cinema.find({status: 1, _id: req.body.info.split(',')[2], 'area.name' : req.body.site})
            .then(cinema => {
                var seats =[];
                var time = req.body.info.split(',')[0];
                var room_name ='';

                [cinema] = cinema.map(curr => curr.toObject());

                // lọc cinema 
                cinema.rooms = cinema.rooms.filter(room => {
                    if(room._id == req.body.info.split(',')[1]){
                        room.showTimes = room.showTimes.filter(showTime => {
                            if(showTime.time == req.body.info.split(',')[0] &&
                                showTime.date == req.body.day &&
                                showTime.film._id == req.body.film && 
                                showTime.quality.name == req.body.option 
                            ){
                                return true;
                            }
                        })      
                        return true;
                    }
                    else{
                        return false;
                    }
                })

                cinema.rooms.map(room => {
                    if(room._id == req.body.info.split(',')[1]){
                        room_name = room.name;
                        room.showTimes[0].seats.map((seat,index) => {
                            if(!seats.some(curr => curr.name == seat.name[0]))
                                if((seats[seats.length-1])){
                                    if(String.fromCharCode((seats[seats.length-1].name).charCodeAt(0) + 1) == seat.name[0]){
                                        seats.push({name : seat.name[0], brand: seat.brand,color: seat.brand.color, seats: []});
                                    }
                                    else{
                                        var length = seat.name[0].charCodeAt(0) - (seats[seats.length-1].name).charCodeAt(0);
                                        for(let i =1 ; i<length ; i++){
                                            seats.push({name : String.fromCharCode((seats[seats.length-1].name).charCodeAt(0) + 1), brand : {color: 'red'}, seats: []});
                                        }
                                        seats.push({name : seat.name[0], brand: seat.brand,color: seat.brand.color, seats: []});
                                    }
                                }
                                else{
                                    var length = seat.name[0].charCodeAt(0) - ('A').charCodeAt(0);
                                    if(length !=0){
                                        for(let i=0;i<length ;i++){
                                            seats.push({name : String.fromCharCode(('A').charCodeAt(0) + i), brand : {color: 'red'}, seats: []});
                                        }
                                        seats.push({name: seat.name[0], brand: seat.brand,color: seat.brand.color, seats: []})
                                    }
                                    else{
                                        seats.push({name: seat.name[0], brand: seat.brand, color: seat.brand.color, seats: []})
                                    }
                                }
                        })

                        seats.map(curr => {
                            let dem =1;
                            var color ='';
                            room.showTimes[0].seats.map(seat => {
                                if(curr.name == seat.name[0]){
                                    if(curr.seats[curr.seats.length-1]){
                                        if(parseInt(seat.name.slice(1) - curr.seats[curr.seats.length-1].name[1]) == 1)
                                        {
                                            curr.seats.push({
                                                name : seat.name,
                                                status: seat.status
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
                                                status: seat.status
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
                                            status: seat.status
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
                            //     for(let i=0;i< room.row - seats.length ;i++){
                            //         seats.push({name : String.fromCharCode((seats[seats.length-1].name).charCodeAt(0) + 1),brand: '', seats : seatsFake});
                            //     }
                            // }
                        })
                    }
                })      
                console.log(seats[0].seats) 
                res.render('pages/booking',{
                    layout: 'main',
                    cinema,
                    seats
                });
                 
            })
            .catch(err => next(err));
    },
    pay(req,res,next) {
        Cinema.findById({ _id : req.body.cinema})
            .then(cinema =>{
                cinema = cinema.toObject();

                // lọc cinema 
                cinema.rooms = cinema.rooms.filter(room => {
                    if(room._id == req.body.room){
                        room.showTimes = room.showTimes.filter(showTime => {
                            if(showTime.time == req.body.time &&
                                showTime.date == req.body.day &&
                                showTime.film._id == req.body.film && 
                                showTime.quality._id == req.body.quality 
                            ){
                                return true;
                            }
                        })      
                        return true;
                    }
                    else{
                        return false;
                    }
                })
                
                res.render('pages/payment',{
                    cinema,
                    total: req.body.total,
                    seats: req.body.seat
                });
            })
    },
    finally(req,res,next) {
        console.log(req.body)
        Promise.all([
            Cinema.findById({ _id : req.body.cinema}),
            User.find({status: true})
        ])
            .then(([cinema,users]) =>{
                var seats = [];
                users = users.map(curr => curr.toObject());
                var user = jwt.verify(req.cookies.token, 'mk');
                var showTime_id = '';
                // lọc cinema 
                cinema.rooms = cinema.rooms.filter(room => {
                    if(room._id == req.body.room){
                        room.showTimes = room.showTimes.filter(showTime => {
                            showTime_id = showTime._id
                            if(showTime.time == req.body.time &&
                                showTime.date == req.body.day &&
                                showTime.film._id == req.body.film && 
                                showTime.quality._id == req.body.quality 
                            ){
                                return true;
                            }
                        }) 
                        if(room.showTimes.length > 0){
                            return true;
                        }     
                    }
                    else{
                        return false;
                    }
                })

                req.body.seat.split(',').map(seat => {
                    seats.push({
                        name: seat
                    })
                })

                // 

                // Tìm ra id ghế
                var seatIds = [];
                cinema.rooms[0].seats.map(seat => {
                    if((req.body.seat.split(',')).some(curr =>  curr == seat.name)){
                        seatIds.push(seat._id);
                    }
                })
                

                var result = {
                    user: user,
                    total: req.body.total,
                    cinema: cinema,
                    seats: seats,
                    status: true
                }

                const receipt = new Receipt(result)
                receipt.save()
                    .then(() => {
                        seatIds.map(seatId => {
                            cinema.rooms.id(req.body.room).showTimes.id(showTime_id).seats.id(seatId).set({status : "selected"})
                        })

                        cinema.save()
                            .then(() => {
                            cinema = cinema.toObject();
                                res.render('pages/finally');
                            })
                            .catch(err => next(err));
                    })
                    .catch(err => next(err));
            })
    },
}

module.exports = categoryController;