const Film = require('../modules/films')
const Category = require('../modules/category')
const SubCategory = require('../modules/subCategory')
const Area = require('../modules/area')
const Room = require('../modules/room')
const ShowTime = require('../modules/showtime')


var categoryController={
    show(req,res,next) {
        Promise.all([Film.find({status:1,sub_category : req.query.type}).populate('sub_category')])
            .then(([films]) =>{
                films = films.map(film => film.toObject());
                res.render('pages/category',{
                    films,
                });
            })
            .catch(err => next(err));
    },
    detail(req,res,next) {
        Film.findById({status: 1, _id :req.query.id})
            .then((film) => {
                film = film.toObject();
                res.render('pages/fiml',{
                    film
                });
            })
    },
    booking(req,res,next) {
        [req.body.time,req.body.cinema,req.body.room_id,req.body.date,req.body.quality] = req.body.desc.split(',');
        var filmDesc = req.body;
        console.log(req.body.room_id)
        Film.findById({status: 1, _id: 1})
            .then(film => {
                film = film.toObject();
                Room.findById({_id: req.body.room_id})
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
                        console.log(result)
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
                        console.log(rowlength)
                        if(rowlength < room.row){
                            var seatsFake = [];
                            for(let i=1; i<= rowlength ; i++){
                                seatsFake.push({name : '',brand: '', index : i});
                            }
                            for(let i=0;i< room.row - result.length ;i++){
                                result.push({name : String.fromCharCode((result[result.length-1].name).charCodeAt(0) + 1),brand: '', seats : seatsFake});
                            }
                        }
                    })
                    // console.log(result)
                    res.render('pages/booking',{
                        layout: 'main',
                        result,
                        filmDesc,
                        film
                    });
                })
                .catch(error => next(error));
            })
            .catch(err => next(err));
    },
    pay(req,res,next) {
        res.render('pages/payment');
    },
    finally(req,res,next) {
        res.render('pages/finally');
    },
    handleDate(req,res,next) {
        Promise.all(
            [
                Film.find({status:1,category : req.query.type, _id: req.query.id}),
                ShowTime.find({status: 1,film_id: req.query.id,date: req.query.date}).populate({path: 'cinema_id',populate: 'area'})
            ]
        )
            .then(([film,showTimes]) =>{
                film = film.map(film => film.toObject());
                showTimes = showTimes.map(showTime => showTime.toObject());
                res.render('pages/fiml',{
                    film,
                    showTimes
                });
            })
            .catch(err => next(err));
    },
    handleArea(req,res,next) {
        Promise.all(
            [
                Film.find({status:1,category : req.query.type, _id: req.query.id}),
                ShowTime.find({status: 1,film_id: req.query.id,date: req.query.date,}).populate({path: 'cinema_id',populate: 'area'})
            ]
        )
            .then(([film,showTimes]) =>{
                film = film.map(film => film.toObject());
                showTimes = showTimes.map(showTime => showTime.toObject());
                res.render('pages/fiml',{
                    film,
                    showTimes
                });
            })
            .catch(err => next(err));
    },
}

module.exports = categoryController;