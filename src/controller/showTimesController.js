const ShowTime = require('../modules/showtime')
const Room = require('../modules/room')
const Film = require('../modules/films')
const Cinema = require('../modules/cinemas')
const Quality = require('../modules/quality')

var showTimeController={
    index(req,res,next) {
        Cinema.findById({_id: req.query.cinema_id})
            .then((cinema) => {
                cinema = cinema.toObject();
                var [room]= cinema.rooms.filter(curr => curr._id == req.query.room_id);
                console.log(room.showTimes)
                res.render('admin/showTimes/index',{
                    layout: 'main2',
                    room,
                    cinema
                });
            })
            .catch(error => next(error));
    },
    create(req,res,next) {
        Promise.all([Cinema.findById({_id: req.query.cinema_id}),Film.find({status: true})])
            .then(([cinema,films]) => {
                cinema = cinema.toObject();
                films = films.map(curr => curr.toObject());
                var [room] = cinema.rooms.filter(curr => curr._id == req.query.room_id);
                if(room.showTimes[0]){
                    var expired = room.showTimes[room.showTimes.length - 1].expired;
                }
                res.render('admin/showTimes/create',{
                    layout: 'main2',
                    room,
                    cinema,
                    films,
                    expired
                });
            })
            .catch(error => next(error));
    },
    handleCreate(req,res,next) {
        Promise.all([
            Cinema.findById({_id: req.query.cinema_id}),
            Film.findById({_id: req.body.film_id}),
            Quality.findById({_id: req.body.quality_id}),
        ])
            .then(([cinema,film,quality]) => {
                var seats =[];
                req.body.film = {
                    _id: film._id,
                    name: film.name,
                    minute: film.minute,
                    image: film.image
                }

                req.body.quality = {
                    _id: quality._id,
                    name: quality.name
                }

                cinema.rooms.map(room => {
                    if(room._id == req.query.room_id){
                        seats  = [...room.seats]
                    }
                })
                
                console.log(seats)
                req.body.seats = seats;

                // set giờ kết thúc
                var minute = film.minute;
                var time = req.body.time;
                var seconds = ((time.split(':')[0]) * 3600 + (time.split(':')[1]) * 60  + minute * 60)  ; 
                const hours = new Date(seconds* 1000).toISOString().slice(11, 16);
                req.body.expired = hours

                cinema.rooms.id(req.query.room_id).showTimes.push(req.body);
                cinema.save()
                    .then(() => {
                        res.redirect('/admin/showTimes?room_id='+ req.query.room_id +'&cinema_id=' + req.query.cinema_id);
                    })
                    .catch(err => res.status(400).send(err.message))
            })
            .catch(error => next(error));
    },
    handleQualityreate(req,res,next) {
        Film.find({status: 1, category: 'Phim đang chiếu',_id: req.query.id}).populate('quality._id')
            .then((film) =>{
                var room_id = req.query.room_id;
                var cinema_id = req.query.cinema_id;
                film = film.map(film => film.toObject());
                res.render('admin/showTimes/create',{
                    layout: 'main2',
                    film,
                    room_id,
                    cinema_id
                });
            })
            .catch(err => next(err));
    },
    update(req,res,next) {
        Promise.all([
            Cinema.findById({_id: req.query.cinema_id}),
            Film.find({status: true}),
        ])
        .then(([cinema,films]) => {
            cinema = cinema.toObject();
            films = films.map(curr => curr.toObject());
            var [room] = cinema.rooms.filter(curr => curr._id == req.query.room_id);
            if(room.showTimes[0]){
                var expired = room.showTimes[room.showTimes.length - 1].expired;
            }
            var showTime = room.showTimes.find(curr => curr._id == req.query.showTime_id);

            films.map(curr => {
                if(curr._id == showTime.film._id){
                    return curr.selected = true;
                }
            })
            
            var film = films.find(curr => curr._id == showTime.film._id);
            console.log(showTime.quality._id)

            var qualities = film.quality.map(curr => {
                if(curr._id == showTime.quality._id){
                    curr.selected = true;
                }
                    return curr;
            })

            console.log(qualities)
            res.render('admin/showTimes/update',{
                layout: 'main2',
                room,
                cinema,
                films,
                expired,
                qualities,
                showTime
            });
        })
        .catch(error => next(error));
    },
    handleUpdate(req,res,next) {
        Promise.all([
            Cinema.findById({_id: req.query.cinema_id}),
            Film.findById({_id: req.body.film_id}),
            Quality.findById({_id: req.body.quality_id}),
        ])
            .then(([cinema,film,quality]) => {
                req.body.film = {
                    _id: film._id,
                    name: film.name,
                    minute: film.minute
                }

                req.body.quality = {
                    _id: quality._id,
                    name: quality.name
                }
                
                // set giờ kết thúc
                var minute = film.minute;
                var time = req.body.time;
                var seconds = ((time.split(':')[0]) * 3600 + (time.split(':')[1]) * 60  + minute * 60)  ; 
                const hours = new Date(seconds* 1000).toISOString().slice(11, 16);
                req.body.expired = hours


                cinema.rooms.id(req.query.room_id).showTimes.push(req.body);
                cinema.save()
                    .then(() => {
                        res.redirect('/admin/showTimes?room_id='+ req.query.room_id +'&cinema_id=' + req.query.cinema_id);
                    })
                    .catch(err => res.status(400).send(err.message))
            })
            .catch(error => next(error));
    },
    delete(req,res,next) {
        Cinema.findById({_id : req.query.cinema_id})
            .then((cinema) =>{
                cinema.rooms.id(req.query.room_id).showTimes.id(req.query.showTime_id).remove();
                cinema.save()
                    .then(() => {

                    })
                    .catch(err => res.status(500).send(err.message));
                res.redirect('/admin/showTimes?cinema_id='+ req.query.cinema_id +'&room_id='+ req.query.room_id);
            })
            .catch(err => next(err));
    },
}
module.exports = showTimeController;